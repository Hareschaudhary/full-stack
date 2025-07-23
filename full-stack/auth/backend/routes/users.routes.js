import express from "express"
const router = express.Router()
import Users from "../models/users.models.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await Users.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: "UserName Or Email already Exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new Users({ username, email, password: hashedPassword })
    const savedUser = await user.save()

    res.json(savedUser)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await Users.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User Not Found" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Password" })
    }

    const token = jwt.sign(
      { UserId: user._id, UserName: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    )

    res.json({token})
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post('/logout', async (req, res) => {
  res.json({ message: "Log Out Successfully" })
})

export default router
