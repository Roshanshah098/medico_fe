import React, { useEffect, useRef, useState } from "react";
import {
  ApiGetAllChats,
  ApiGetAllChatsByConsultation,
  ApiRateDoctor,
  ApiSendMessage,
} from "../../api/chat";
import { useUserStore } from "../../stores/tokenStore";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { toast } from "react-toastify";
import { Icons } from "../../assets/icons";

interface ChatMessage {
  id?: string;
  sender: string;
  sender_name: string;
  user_type: string | null;
  message: string;
  isTemporary?: boolean;
}

const SingleChat = () => {
  const { userProfile } = useUserStore();
  const [chatWith, setChatWith] = useState("");
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);

  console.log(id);

  const form = useForm({
    initialValues: {
      message: "",
    },
    validate: {
      message: (value) =>
        value.length < 4 ? "Write a message longer than 4 characters" : null,
    },
  });

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userProfile?.email) return;

    const messageText = form.values.message;
    if (!messageText) return;

    // Create temporary message
    const tempMessage: ChatMessage = {
      sender: userProfile.email,
      message: messageText,
      sender_name: userProfile.name || "",
      user_type: userProfile.role,
      isTemporary: true,
    };

    // Add temporary message to chats array at the beginning since display is reversed
    setChats((prev) => [tempMessage, ...prev]);

    // Clear the input
    form.setFieldValue("message", "");

    try {
      const payload = {
        consultation: id,
        message: messageText,
      };
      const res = await ApiSendMessage(payload);

      // Update the temporary message with the actual response
      setChats((prev) =>
        prev.map((msg) =>
          msg.isTemporary ? { ...res.data, isTemporary: false } : msg
        )
      );

      toast.success("Message Sent");
    } catch (error: any) {
      // Remove the temporary message if API call fails
      setChats((prev) => prev.filter((msg) => !msg.isTemporary));
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const fetchAllChatsByConsultation = async () => {
    if (!id) return;
    try {
      const response = await ApiGetAllChatsByConsultation(id);
      setChats(response?.data?.results || []);
    } catch (error) {
      console.error("Error fetching consultations:", error);
    }
  };

  useEffect(() => {
    fetchAllChatsByConsultation();
  }, [id]);

  // Scroll to bottom when chats change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats]);

  return (
    <>
      <div className="w-full h-full flex relative">
        <div className="w-fit p-5 absolute top-0 left-0">
          <button
            className="p-2 bg-red-500 text-white rounded-full border border-gray-300 hover:bg-red-600 transition duration-200"
            onClick={() => navigate(-1)}
          >
            <Icons.AngleLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full flex gap-6 px-8 pt-6">
          {/* left image */}
          {userProfile?.role === "Doctor" ? (
            <div className="w-3/12 flex items-center justify-center">
              <img src="/patient.jpg" alt="" />
            </div>
          ) : (
            <div className="w-3/12 flex items-center justify-center">
              <img src="/doctor.jpg" alt="" />
            </div>
          )}

          <div className="w-6/12">
            <div className="flex py-3 px-4 border-b items-center gap-4">
              {userProfile?.role === "Patient" ? (
                <img src="/doctorProfile.jpg" alt="" className="size-12" />
              ) : userProfile?.gender === "Female" ? (
                <img src="/female.jpg" alt="" className="size-12" />
              ) : (
                <img src="/male.jpg" alt="" className="size-12" />
              )}
              <h2 className="text-xl font-bold text-primary-500">
                {userProfile?.role === "Patient" ? "Dr." : ""} {chatWith}
              </h2>
            </div>
            <div className="w-full py-4 px-2 h-[70vh] overflow-y-auto  mx-auto ">
              {[...chats].reverse().map((item, index) => {
                if (item.user_type != userProfile?.role && chatWith === "") {
                  setChatWith(item.sender_name);
                }

                return (
                  <div
                    key={item.id || index}
                    className={`w-full flex items-end gap-2 pb-6 ${
                      item.user_type === userProfile?.role ? "justify-end" : ""
                    }`}
                  >
                    {userProfile?.role != item.user_type &&
                      (userProfile?.role === "Patient" ? (
                        <img
                          src="/doctorProfile.jpg"
                          alt=""
                          className="size-7"
                        />
                      ) : userProfile?.gender === "Male" ? (
                        <img src="/male.jpg" alt="" className="size-7" />
                      ) : (
                        <img src="/female.jpg" alt="" className="size-7" />
                      ))}
                    <div
                      className={`p-3 rounded-xl border  max-w-[70%] shadow-sm border-gray-300 ${
                        item.user_type === userProfile?.role
                          ? "bg-blue-600 text-white"
                          : "bg-gray-300 text-black"
                      } ${item.isTemporary ? "opacity-70" : ""}`}
                    >
                      <div className="">{item.message}</div>
                    </div>
                    {userProfile?.role === item.user_type &&
                      (userProfile?.role === "Patient" ? (
                        userProfile?.gender === "Male" ? (
                          <img
                            src="/male.jpg"
                            alt=""
                            className="size-7 rounded-full"
                          />
                        ) : (
                          <img
                            src="/female.jpg"
                            alt=""
                            className="size-7 rounded-full"
                          />
                        )
                      ) : (
                        <img
                          src="/doctorProfile.jpg"
                          alt=""
                          className="size-7 rounded-full"
                        />
                      ))}
                  </div>
                );
              })}

              {/* This ref will auto-scroll to bottom */}
              <div ref={bottomRef} />
            </div>

            <Box className="py-6 border-t flex justify-between w-full max-w-3xl mx-auto">
              <form onSubmit={handleSendMessage} className="w-full flex gap-4">
                <TextInput
                  {...form.getInputProps("message")}
                  className="w-full"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 
                               text-white font-medium rounded-xl shadow-xl hover:shadow-2xl 
                               transform hover:scale-102 transition-all duration-300 w-1/4"
                >
                  Send
                </Button>
              </form>
            </Box>
          </div>

          {/* right image */}
          {userProfile?.role === "Doctor" ? (
            <div className="w-3/12 flex items-center justify-center">
              <img src="/doctor.jpg" alt="" />
            </div>
          ) : (
            <div className="w-3/12 flex items-center justify-center">
              <img src="/patient.jpg" alt="" />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleChat;
