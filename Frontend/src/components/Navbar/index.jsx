import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

export default function Navbar() {
  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="bg-[#FFAE5A] border-b border-gray-200 fixed w-full top-0 z-50 ">
      <div className="container mx-auto px-4 h-16">
        <div className="flex justify-between items-center h-full text-white">
          {/* logo */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg flex items-center justify-center ">
                <MessageSquare className="w-5 h-5 " />
              </div>

              <h1 className="text-lg font-bold">Chat App</h1>
            </Link>
          </div>

          {/* links */}

          <div className="flex items-center text-md gap-4 sm:gap-8">
            <Link to={"/settings"} className=" flex items-center gap-2">
              <Settings className="w-5 h-5 " />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="flex items-center gap-2">
                  <User className="w-5 h-5 " />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center cursor-pointer gap-2 hover:opacity-80 transition-all"
                >
                  <LogOut className="w-5 h-5 " />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
