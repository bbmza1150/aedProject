const express = require('express'); 


const {admin_UpdateUser,admin_DeleteUser} = require('../controllers/actionAdminContrller');
const {createProject,updateProject,getProject,getProjects,deleteProject} = require("../controllers/projectController");

const authenticateToken = require("../middlewares/auth");

const router = express.Router();


router.put('/update/user/:id',authenticateToken, admin_UpdateUser);
router.delete('/delete/user/:id',authenticateToken, admin_DeleteUser);

router.post("/create/project",authenticateToken,createProject);
router.delete("/delete/project/:project_id",authenticateToken,deleteProject);
router.put("/update/project/:project_id",authenticateToken, updateProject);
router.get("/project/:project_id",authenticateToken, getProject);
router.get("/projects",authenticateToken, getProjects);

module.exports = router;