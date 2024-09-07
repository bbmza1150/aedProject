const express = require('express');
const dot_env = require('dotenv');
const app = express();
const path = require('path'); 
dot_env.config();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))

app.use(express.static(path.join(__dirname, 'public')));

const authRoute = require('./routes/auth_admin');
app.use('/api/auth/admin',authRoute);

const UserRoute = require('./routes/User');
app.use('/api/user',UserRoute);

const adminRoute = require('./routes/admin_action');
app.use('/api/admin',adminRoute);

const ProjectRoute = require('./routes/project');
app.use('/api/project',ProjectRoute);

app.get('/smp/sci/tsu', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html')); // ชี้ไปยังไฟล์ HTML ของคุณ
});

app.get('/admin/projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'projects.html')); // ชี้ไปยังไฟล์ HTML ของคุณ
});

app.get('/admin/add/project', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add_project.html')); // ชี้ไปยังไฟล์ HTML ของคุณ
});

app.get('/admin/project/view', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'detail_project.html'));
});

app.get('/admin/project/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'edit_project.html'));
});

app.use('/',function(req,res,next){
    res.sendStatus(404);
});

app.listen(PORT, ()=>
    console.log(`Server running on port : `+PORT)
);