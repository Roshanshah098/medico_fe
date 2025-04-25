import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiGetAllChats, ChatMessage } from "../../api/chat";
import { useUserStore } from "../../stores/tokenStore";

const Chats = () => {
  const navigate = useNavigate();
  const { userProfile } = useUserStore();
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [allChats, setAllChats] = useState<ChatMessage[]>([]);

  const fetchAllChats = async () => {
    try {
      const response = await ApiGetAllChats();
      const allChats = response.results;
      setAllChats(allChats);

      const latestChatsMap = new Map<number, ChatMessage>();
      allChats.forEach((chat) => {
        const existing = latestChatsMap.get(chat.consultation);
        if (!existing || new Date(chat.created) > new Date(existing.created)) {
          latestChatsMap.set(chat.consultation, chat);
        }
      });

      const uniqueChats = Array.from(latestChatsMap.values());
      setChats(uniqueChats);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  console.log(allChats);
  console.log(chats);

  useEffect(() => {
    fetchAllChats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Recent Chats</h1>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center">No chats available</p>
      ) : (
        <div className="space-y-4">
          {chats.map((chat) => {
           const relatedChats = allChats.filter(c => c.consultation === chat.consultation);

           const newChat =
             relatedChats.length === 1 ||
             relatedChats.every(c => c.sender === relatedChats[0].sender);

            return (
              <div
                key={chat.id || chat.consultation}
                onClick={() => navigate(`/chat/${chat.consultation}`)}
                className={`p-5 relative border border-gray-200 rounded-2xl shadow- cursor-pointer hover:scale-105 transition-all duration-200 
              ${
                newChat ? "bg-blue-100 border-blue-600 border-2" : "bg-blue-100"
              }`}
              >
                  <span className={`absolute -top-3 -right-3 bg-primary-400 rounded-full text-sm text-white p-2 size-10 items-center  ${newChat ? "flex" : "hidden"}`}>New</span>
                <div className="flex justify-between items-center mb-2 ">

                  <h2 className="text-lg font-semibold text-gray-700">
                    Consultation #{chat.consultation}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {new Date(chat.timestamp || chat.created).toLocaleString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  <strong className="text-gray-800">{chat.sender}:</strong>{" "}
                  {chat.message}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Chats;
