import authorizedAxiosInstance from "~/utils/authorizedAxios";
import { API_ROOT } from "~/utils/constants";

export const handleLogoutApi = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userInfo");

  return await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`);
};

export const refreshTokenApi = async (refreshToken) => {
  return await authorizedAxiosInstance.put(
    `${API_ROOT}/v1/users/refresh_token`,
    {
      refreshToken,
    }
  );
};
