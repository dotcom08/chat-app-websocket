import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import { Camera, Mail, User } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const authUser = useAuthStore((state) => state.authUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const isUpdatingProfile = useAuthStore((state) => state.isUpdatingProfile);

  console.log(authUser);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5 Mo
    if (file.size > maxSize) {
      toast.error("File size exceeds the limit of 5 MB");
      return;
    }

    try {
      const base64Data = await convertToBase64(file);
      const response = await updateProfile({ picProfile: base64Data });

      if (response.success) {
        setSelectedImage(base64Data);
        toast.success("Profile pic updated successfully");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error while uploading image", error);
      toast.error("Error while uploading image");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-[#FFDFAD] rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* avatar */}
          <div className="flex items-center flex-col gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.picProfile || "/avatar.png"}
                alt="profile"
                className="size-32 rounded-full object-cover border-4"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-[#FF7900] p-2 hover:scale-105 rounded-full cursor-pointer transition-all duration-200 ${
                  isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                }`}
              >
                <Camera className="size-5 text-[#0F0600]" />
                <input
                  type="file"
                  name="avatar-upload"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  disabled={isUpdatingProfile}
                  onChange={handleImageUpload}
                />
              </label>
            </div>

            <p className="text-sm text-[#492500]">
              {isUpdatingProfile
                ? "Uploading..."
                : "Click the camera icon to upload your profile picture"}
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center text-sm text-[#492500] gap-2">
                <User className="w-5 h-5" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-slate-200 rounded-lg border">
                {authUser?.fullName}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center text-sm text-[#492500] gap-2">
                <Mail className="w-5 h-5" />
                Email
              </div>
              <p className="px-4 py-2.5 bg-slate-200  rounded-lg border">
                {authUser?.email}
              </p>
            </div>
          </div>

          <div className="mt-6 bg-[#FFDFAD] rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Settings</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member since</span>
                <span>{authUser?.createdAt.split("T")[0]}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span>Account status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
