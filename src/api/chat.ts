import api from "../services/api";

export interface ChatMessage {
  id: number;
  created: string;
  consultation: number;
  sender: string;
  message: string;
  status: string; // You can also use: 'delivered' | 'pending' | 'read' if it's limited
  timestamp: string;
}

export interface ChatMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ChatMessage[];
}


export const ApiGetAllChats = async (): Promise<ChatMessageResponse> => {
  const response = await api.get<ChatMessageResponse>("chats/");
  return response.data;
};


export const ApiSendMessage = async (data: any) => {
  const response = await api.post("chats/", data);
  return response;
};


export const ApiGetAllChatsByConsultation = async (id: string | number) => {
  const response = await api.get(`chats/by-consultation/${id}/`);
  return response;
};
export const ApiRateDoctor = async (id: string | number, rating: number) => {
  const response = await api.post(`consultations/${id}/rate/`, {
    rating,
  });
  return response;
};
export const ApiSendFeedback = async (data: any) => {
  const response = await api.post(`feedback/`, data);
  return response;
};
