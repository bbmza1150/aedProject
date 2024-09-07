const  connection  = require("../db.config");

exports.admin_UpdateUser =  async(req,res) =>{
    const {User_status} = req.body;

    connection.execute("UPDATE users SET User_status=? WHERE User_id=?",
        [User_status, req.params.id]
    ).then(() =>{
        console.log('Update Successfully');
        res.status(200).send("Update Successfully.");
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Error updating user.");
    });
}

exports.admin_DeleteUser = async(req,res) =>{
    connection.execute("DELETE FROM users WHERE User_id =?;",
        [req.params.id]
    ).then(() =>{
        console.log('Delete Successfully');
    }).catch((err) =>{
        console.log(err);
    });
    res.status(200).send("Delete Successfully.");
    res.end();
}