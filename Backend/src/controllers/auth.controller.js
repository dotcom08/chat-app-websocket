import User from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSetCookie from "../lib/index.js";
import supabase from "../lib/supabase.js";

export async function Login(req, res) {
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
    const token = createTokenAndSetCookie(newUser._id, res);

    res.status(200).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function SignUp(req, res) {
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

    res
      .status(200)
      .json({ success: true, message: "User logged in successfully", user });
  } catch (error) {
    console.log("Error in signup controller", error.message);
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

    if (!picProfile) {
      res
        .status(400)
        .json({ success: false, message: "Profile pic is required" });
    }

    const base64Data = picProfile.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const fileName = `profile_${userID}_${Date.now()}.jpg`;

    // Uploader l'image vers Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME) 
      .upload(fileName, buffer, {
        contentType: "image/jpeg", 
        upsert: true, 
      });

    if (uploadError) {
      console.log("Erreur lors de l'upload de l'image", uploadError);
      return res
        .status(400)
        .json({ success: false, message: uploadError.message });
    }

    const { data: publicUrlData } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME)
      .getPublicUrl(fileName);

    const picProfileUrl = publicUrlData.publicUrl;

    const user = await User.findByIdAndUpdate(
      userID,
      { picProfile: picProfileUrl },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile pic updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export function CheckAuth(req, res) {
  try {
    res
      .status(200)
      .json({
        success: true,
        message: "Auth checked successfully",
        user: req.user,
      });
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
