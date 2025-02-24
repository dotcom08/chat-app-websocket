import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSetCookie from "../lib/index.js";
import cloudinary from "../lib/cloudinary.js";

export async function SignUp(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // jsonwebtoken
    createTokenAndSetCookie(newUser._id, res);

    res.status(200).json(newUser);
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function Login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
    }

    createTokenAndSetCookie(user._id, res);

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export function Logout(req, res) {
  try {
    res.clearCookie("jwt");
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function UpdateProfile(req, res) {
  try {
    const { picProfile } = req.body;
    const userID = req.user._id;

    if(!userID) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

    if (!picProfile) {
      res
        .status(400)
        .json({ success: false, message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(picProfile);


    const user = await User.findByIdAndUpdate(
      userID,
      { picProfile: uploadResponse.secure_url },
      { new: true }
    );

    if(!user){
      res.status(400).json({ success: false, message: "User not found" });
    }

    
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export function CheckAuth(req, res) {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in check auth controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export default {
  Login,
  SignUp,
  Logout,
  UpdateProfile,
  CheckAuth,
};
