import express from "express";
const Routes = express.Router();
import path from "path";
import fs from "fs/promises";
import Users from "../models/users.models.js";
import FileUpload from "../midleware/multer.js";

// get all users
Routes.get('/', async (req, res) => {
    try {
        const search = req.query.search || ""
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const query = {
            $or: [
                { first_name: { $regex: search, $options: "i" } },
                { last_name: { $regex: search, $options: "i" } },
            ],
        };
        const totalCount = await Users.countDocuments(query);

        const allUserData = await Users.find(query).skip(skip).limit(limit);
        res.json({
            totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            allUserData
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});

// get single user
Routes.get('/:id', async (req, res) => {
    try {
        const SingleUser = await Users.findById(req.params.id);
        if (!SingleUser) {
            return res.json({ message: "ID Not Found" });
        }
        res.json(SingleUser);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// add user
Routes.post('/', FileUpload.single('profile_pic'), async (req, res) => {
    try {
        const User = new Users(req.body)
        if (req.file) {
            User.profile_pic = req.file.filename
        }
        const NewUser = await User.save()
        res.json(NewUser);
    } catch (error) {
        if (req.file) {
            const FilePath = path.join('./public/uploads', req.file.filename);
            fs.unlink(FilePath, (err) => {
                if (err) {
                    console.error("Failed to delete file:", FilePath, err);
                }
            })
        }
        res.json({ message: error.message });
    }
});

// update user
Routes.put('/:id', FileUpload.single('profile_pic'), async (req, res) => {
    try {
        const presentuser = await Users.findById(req.params.id)

        // if file uplod but id not found
        if (!presentuser) {
            if (req.file) {
                const UplodedFilePath = path.join('./public/uploads', req.file.filename)
                try {
                    await fs.unlink(UplodedFilePath)
                } catch (error) {
                    console.log("Error deleting uploaded image:", error.message);
                }
            }
            return res.status(404).json({ message: "Student not found" });
        }

        //  delete present profile pic
        if (req.file) {
            const Presentimagepath = path.join('./public/uploads', presentuser.profile_pic)
            try {
                await fs.unlink(Presentimagepath, () => {
                    console.log("Old profile image deleted successfully");
                })
            } catch (error) {
                console.log(`Failed to delete old image: ${error.message}`);
            }
        }

        // upload file name
        if (req.file) {
            req.body.profile_pic = req.file.filename
        }

        const UpdateUser = await Users.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(UpdateUser);
    } catch (error) {
        res.json({ message: error.message });
    }
});

// delete user
Routes.delete('/:id', async (req, res) => {
    try {
        let DeletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!DeletedUser) {
            return res.json({ message: "ID Not Found" });
        }
        if (DeletedUser.profile_pic) {
            const filePath = path.join('./public/uploads', DeletedUser.profile_pic)
            fs.unlink(filePath, (err) => {
                console.log(`file delete ${err}`);
            })
        }
        res.json(DeletedUser);
    } catch (error) {
        res.json({ message: error.message });
    }
});

export default Routes;
