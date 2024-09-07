const express = require('express');
const router = express.Router();

const {getProject,getProjects} = require("../controllers/projectController");
router.post("/", async(req,res)=>{
    res.sendStatus(404);
});

router.get("/:project_id", getProject);
// router.get("/", getProjects);

module.exports = router;