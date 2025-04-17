import api from "../services/api";

export const getMyProfile = async (id:any) => {
    const response = await api.get(`/users/profile/`);
    return response;
  };