const File = require("../models/file");
const { StatusCodes } = require("http-status-codes");

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
  const image = req.file;

  if (!question || !answers || !priority) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Missing fields" });
  }

  try {
    const newFile = new File({
      question,
      answers,
      image: image?.path,
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
    const updatedFields = {
      question: req.body.question,
      answers: req.body.answers,
      priority: req.body.priority,
    };

    if (req.file) {
      updatedFields.image = req.file.path;
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
