const express = require("express");
const router = express.Router();
const FileRouter = require("../controllers/file");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/faq", FileRouter.getFile);
router.post("/faq/create", upload.single("image"), FileRouter.createFile);
router.put("/faq/:id", upload.single("image"), FileRouter.editFile);
router.delete("/faq/:id", FileRouter.deleteFile);

module.exports = router;
