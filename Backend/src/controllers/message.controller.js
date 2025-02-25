import User from "../models/auth.model.js";
import Message from "../models/message.model.js";

export async function getUsersForSidebar(req, res) {
  try {
    const activeUserID = req.user._id;

    const users = await User.find({ _id: { $ne: activeUserID } }).select(
      "-password"
    );

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in get users for sidebar controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: receiverId } = req.params;
    const activeUserID = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: activeUserID, receiverId },
        { senderId: receiverId, receiverId: activeUserID },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in get messages controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function sendMessage(req, res) {
  try {
    const { id: receiverId } = req.params;
    const activeUserID = req.user._id;

    const { text, image } = req.body;
    let imageurl = null;

    if (image) {
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

      imageurl = publicUrlData.publicUrl;
    }

    const message = await Message.create({
      senderId: activeUserID,
      receiverId,
      text: text || "",
      image: imageurl || "",
    });

    //socket.emit('message', message);

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in send message controller", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
}

export default {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
