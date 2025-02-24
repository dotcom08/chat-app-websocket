import { EyeOff, Mail, MessageSquare, User, Eye, Lock } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../../components/AuthImagePattern";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const signup = useAuthStore((state) => state.signUp);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleValidateForm = () => {
    if (formData.fullName.trim() === "") {
      return toast.error("Full name is required");
    }
    if (formData.email.trim() === "") {
      return toast.error("Email is required");
    }

    if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      return toast.error("Invalid email format");
    }

    if (formData.password.trim() === "") {
      return toast.error("Password is required");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (handleValidateForm()) {
      signup(formData);
    }
  };

  return (
    <div className="h-screen grid lg:grid-cols-2 bg-[#FFF3E7] text-[#492500]">
      {/* leftside */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition-all">
                <MessageSquare className="w-6 h-6 " />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create an account</h1>
              <p className="text-lg font-light">
                Get started with your free account
              </p>
            </div>
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="fullName" className="mb-2">
                <span>Fullname</span>
              </label>
              <div className="relative flex items-center justify-center gap-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1  flex items-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 pl-8 py-2 text-md outline-none focus:border-[#190D00] transition-all"
                  placeholder="John Doe"
                  required
                  id="fullName"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="mb-2">
                <span>Email</span>
              </label>
              <div className="relative flex items-center justify-center gap-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1  flex items-center">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 pl-8 py-2 text-md outline-none focus:border-[#190D00] transition-all"
                  placeholder="you@example.com"
                  required
                  id="email"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label htmlFor="password" className="mb-2">
                <span>Password</span>
              </label>
              <div className="relative flex items-center justify-center gap-2">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-1 flex items-center">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 pl-8 py-2 text-md outline-none focus:border-[#190D00] transition-all"
                  placeholder="••••••••"
                  required
                  id="password"
                />

                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 pr-1 flex items-center justify-center cursor-pointer border-none outline-none"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full  bg-[#EC7900] text-white px-4 py-2 rounded-lg hover:bg-[#FFE3C6] hover:text-[#492500] transition-all cursor-pointer"
            >
             {
               isSigningUp ? "Loading..." : "Sign up"
             }
            </button>
          </form>

          <div className="text-center">
            <p className="font-light text-md">
              {"Already have an account? "}
              <Link to={"/login"} className="">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <div>
        <AuthImagePattern
          title={"Join our community"}
          subtitle={
            "Connect with friends, share moments, and stay in touch with your loved ones."
          }
        />
      </div>
    </div>
  );
}
