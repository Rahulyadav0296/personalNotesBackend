const File = require("../models/file");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dksc6pmhj",
  api_key: "593397163278856",
  api_secret: "h3cfk_bqcDGlkMmtZHZch2HVJmw",
});

exports.getFile = async (req, res) => {
  try {
    const files = await File.find();
    return res.status(StatusCodes.OK).json(files);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

exports.createFile = async (req, res) => {
  const { question, answers, priority } = req.body;
  if (!question || !answers || !priority) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing fields" });
  }

  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const results = await Promise.allSettled(uploadPromises);
      results.forEach((result) => {
        if (result.status === "fulfilled") {
          imageUrls.push(result.value.secure_url);
        }
      });

      if (imageUrls.length === 0) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Image Upload Failed!" });
      }
    }

    const newFile = new File({
      question,
      answers,
      image: imageUrls,
      priority,
    });

    const savedFile = await newFile.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Question created successfully!", file: savedFile });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

exports.editFile = async (req, res) => {
  const { id } = req.params;
  try {
    const existingFile = await File.findById(id);

    if (!existingFile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "File Not Found!" });
    }

    const updatedFields = {
      question: req.body.question,
      answers: req.body.answers,
      priority: req.body.priority,
    };

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload(file.path)
      );
      const results = await Promise.allSettled(uploadPromises);

      const imageUrls = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value.secure_url);

      if (imageUrls.length > 0) {
        updatedFields.image = imageUrls;
      }
    }

    const updatedFile = await File.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    if (!updatedFile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "File not Updated!" });
    }

    return res.status(StatusCodes.OK).json(updatedFile);
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deletedFile = await File.findByIdAndDelete(id);

    if (!deletedFile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "File Not Found!" });
    }

    return res
      .status(StatusCodes.OK)
      .json({ message: "File deleted successfully!" });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error: error.message });
  }
};
