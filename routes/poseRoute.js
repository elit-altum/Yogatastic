const express = require("express");
const poseController = require("../controllers/poseController");

const router = express.Router();

router.post("/findPose", poseController.findPose);

module.exports = router;
