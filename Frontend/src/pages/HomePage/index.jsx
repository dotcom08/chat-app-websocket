import { useChatStore } from "../../store/useChatStore";
import Sidebar from "../../components/Sidebar";
import NoChatSelected from "../../components/NoChatSelected";
import ChatContainer from "../../components/ChatContainer";

export default function HomePage() {
  const selectedUser = useChatStore((state) => state.selectedUser);
  return (
    <div className="h-screen bg-amber-300">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-amber-200 rounded-lg shadow-xl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}
