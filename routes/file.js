const express = require("express");
const router = express.Router();
const FileRouter = require("../controllers/file");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dksc6pmhj",
  api_key: "593397163278856",
  api_secret: "h3cfk_bqcDGlkMmtZHZch2HVJmw",
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.get("/faq", FileRouter.getFile);
router.post("/faq/create", upload.array("images", 10), FileRouter.createFile);
router.put("/faq/:id", upload.array("images", 10), FileRouter.editFile);
router.delete("/faq/:id", FileRouter.deleteFile);

module.exports = router;
