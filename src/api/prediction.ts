import api from "../services/api";

export const APIPredictDisease = async (data: any) => {
  const response = await api.post("/predictions/predict_disease/", data);
  return response;
};


export const APIGetDoctorsBySpecialization = async (id: any) => {
  const response = await api.get(`/specializations/${id}/recommended_doctors/`);
  return response;
};



