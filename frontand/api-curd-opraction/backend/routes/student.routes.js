import express from "express";
const Router = express.Router();
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import Student from "../models/stoodent.model.js";

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

// File Filter Function
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// Multer Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 3, // 3MB
  },
});

// show all data
Router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const query = {
      $or: [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
      ],
    };
    const Studantdata = await Student.find(query);
    res.json(Studantdata);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// show single data
Router.get("/:id", async (req, res) => {
  try {
    const StudentData = await Student.findById(req.params.id);
    if (!StudentData) {
      res.status(404).json({ message: "student not found" });
    } else {
      res.json(StudentData);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// add data
Router.post("/", upload.single("profile_pic"), async (req, res) => {
  try {
    const student = new Student(req.body);

    if (req.file) {
      student.profile_pic = req.file.filename;
    }

    const newStudent = await student.save(); // Attempt to save to DB

    res.status(201).json(newStudent);
  } catch (error) {
    // Delete uploaded image if it exists
    if (req.file) {
      const filePath = path.join("./uploads", req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete file:", filePath, err);
        }
      });
    }

    res.status(400).json({ message: error.message });
  }
});

// Update data
Router.put("/:id", upload.single("profile_pic"), async (req, res) => {
  try {
    const existingStudent = await Student.findById(req.params.id);
    if (!existingStudent) {
      if (req.file) {
        const uploadedFilePath = path.join("./uploads", req.file.filename);
        try {
          await fs.unlink(uploadedFilePath);
        } catch (err) {
          console.log("Error deleting uploaded image:", err.message);
        }
      }
      return res.status(404).json({ message: "Student not found" });
    }

    if (req.file) {
      if (existingStudent.profile_pic) {
        const oldFilePath = path.join("./uploads", existingStudent.profile_pic);
        try {
          await fs.unlink(oldFilePath);
          console.log("Old profile image deleted successfully");
        } catch (err) {
          console.log(`Failed to delete old image: ${err.message}`);
        }
      }

      req.body.profile_pic = req.file.filename;
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// delet data
Router.delete("/:id", async (req, res) => {
  try {
    const StudentDelet = await Student.findByIdAndDelete(req.params.id);
    if (!StudentDelet) {
      res.status(404).json({ message: "student not found" });
    }
    if (StudentDelet.profile_pic) {
      const filepath = path.join("./uploads", StudentDelet.profile_pic);
      fs.unlink(filepath, (err) => {
        console.log(`file delete ${err}`);
      });
    }

    res.json(StudentDelet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default Router;
