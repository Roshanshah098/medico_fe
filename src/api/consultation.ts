import api from "../services/api";

export const APICreateconsultation = async (data: any) => {
  const response = await api.post("consultations/", data);
  return response;
};
export const APIGetAllDoctors = async () => {
  const response = await api.get("doctors");
  return response;
};
export const APIGetAllConsultations = async () => {
  const response = await api.get("doctor-consultations/");
  return response;
};
export const APIGetAllConsultationsByPatient = async () => {
  const response = await api.get("consultations/");
  return response;
};

export const APIAcceptConsultation = async (id: any) => {
  const response = await api.post(`doctor-consultations/${id}/accept/`);
  return response;
};
export const APIEndConsultation = async (id: any) => {
  const response = await api.post(`chats/end-consultation/${id}/`);
  return response;
};
