const bcrypt = require("bcryptjs");
const crypto = require("crypto")
const jwt = require("jsonwebtoken");
const dot_env = require("dotenv");
const  connection  = require("../db.config");

dot_env.config();

exports.register = async (req,res) => {
    const {username ,password ,Fname ,Lname ,admin_image ,telephone ,email} = req.body;

    if(!username ||!password ||!Fname  ||!Lname ||!admin_image||!telephone||!email){
        return res.status(400).send('Missing required fields');
    }

    let mypass = crypto.createHash('md5').update(password).digest("hex");
    const now = new Date().toISOString().slice(0,19).replace('T',' ');

    try{
        const [rows] = await connection.query('SELECT admin_id FROM ADMIN ORDER BY admin_id DESC LIMIT 1');
        let newAdminId = 'A01';
        if (rows.length > 0) {
            let lastAdminId = rows[0].admin_id;
            
            // แยกตัวอักษรและตัวเลขออกจากรหัสล่าสุด
            let lastLetterPart = lastAdminId.substring(0, 1); // ตัวอักษร
            let lastNumberPart = parseInt(lastAdminId.substring(1), 10); // ตัวเลข

            if(lastNumberPart < 99){
                lastNumberPart += 1;
            }else{
                lastNumberPart = 1;
                if(lastLetterPart < 'Z'){
                    lastLetterPart = String.fromCharCode(lastLetterPart.charCodeAt(0) + 1);
                }else{
                    throw new Error('Reached maximum ID value');
                }
            }

            // สร้างรหัสใหม่
            newAdminId = `${lastLetterPart}${lastNumberPart.toString().padStart(2, '0')}`;
        }

        connection.execute(`INSERT INTO admin(admin_id ,admin_username ,admin_password ,admin_Fname ,admin_Lname ,admin_image ,admin_tel ,admin_email ,	created_at ,updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                newAdminId,, username, mypass, Fname, Lname, admin_image, telephone, email, now, now
            ]
        );

        console.log("Insert successfully");
        res.status(201).send('Admin register successfully');

    }catch (err){
        console.error(err);
        res.status(500).send('Error inserting admin');
    }

}

exports.login = async (req,res) =>{
    const {username , password} = req.body;
    let mypass = crypto.createHash('md5').update(password).digest("hex");

    connection.execute('SELECT admin_username ,admin_Fname ,admin_Lname ,admin_image ,admin_tel ,admin_email ,created_at ,updated_at FROM ADMIN WHERE admin_username=? AND admin_password=?',
        [username, mypass]
    ).then((result) =>{
        var data = result[0];
        if(data.length === 0){
            res.status(400).send('Admin not found');
        }else{
            
            const accessToken = jwt.sign(
                {userId : data.admin_id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn : "1h"}
            );
            const refreshToken = jwt.sign(
                {userId: data.admin_id},
                process.env.REFRESH_TOKEN_SECRET
            );
            res.json({data,accessToken, refreshToken});
        }
    }).catch((err) =>{
        console.log(err);
        res.status(500).end('Error fetching Admin')
    })
}

exports.refresh = async(req,res) =>{
    const {token} = req.body;

    if(!token) return res.sendStatus(401);

    jwt.verify(token , process.env.REFRESH_TOKEN_SECRET, (err, user)=>{
        if(err) return res.sendStatus(403);
        const accessToken = jwt.sign(
            {userID: user.userId},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:"2h"}
        );
        res.json({accessToken});
    })
}