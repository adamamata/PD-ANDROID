import axios from "axios";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";

import {
  DevURL,
  LOCALSTORE,
  GetRefreshToken,
  GetUserId,
  getRole,
} from "../constant/default";
import { UserRoleEnum } from "../enums/enum";

export const Bearer = "Bearer ";

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    const originalConfig = error.config;
    if (error.status === 501 || error.response?.status === 501) {
      localStorage.clear();
      window.location.assign("/NotFound");
    } else if (
      error.response?.status === 500 &&
      error.response?.data &&
      error.response?.data.message &&
      error.response?.data.message.indexOf("IDX10223") >= 0 &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;
      return refreshToken(originalConfig);
    } else {
      const errMessage = error.response || error;
      return Promise.reject(errMessage);
    }
  }
);

const logout = () => {
  window.localStorage.clear();

  if (getRole() == UserRoleEnum.ServiceProvider) {
    window.location.href = "/login";
  } else {
    window.location.href = "/login";
  }
};

const refreshToken = async (config) => {
  const refreshToken = GetRefreshToken();
  const userId = GetUserId();
  if (!refreshToken || !userId) {
    logout();
    return;
  }
  try {
    const { data } = await axios.put(
      `${DevURL}authapi/auths/${localStorage.getItem(
        LOCALSTORE.id
      )}/refresh-token`,
      {
        RefreshToken: refreshToken,
      }
    );

    localStorage.setItem(LOCALSTORE.token, data.jwtToken);
    localStorage.setItem(LOCALSTORE.refreshToken, data.refreshToken);

    config.headers = {
      Authorization: "Bearer " + data.jwtToken,
    };
    return axios(config);
  } catch (error) {
    logout();
    return;
  }
};

const axoisAPI = {
  postForm: (url, data) => {
    return axios.postForm(DevURL + url, data);
  },

  post: (url, data) => {
    return axios.post(DevURL + url, data);
  },

  put: (url, data) => {
    return axios.put(DevURL + url, data);
  },

  get: (url) => {
    return axios.get(DevURL + url);
  },

  postwithCaptch: (url, data , token) => {
    return axios({
      method: "post",
      data,
      headers: {
        recaptcha: token,
      },
      url: DevURL + url,
    });
  },
  
  putwithCaptch: (url, data , token) => {
    return axios({
      method: "put",
      data,
      headers: {
        recaptcha: token,
      },
      url: DevURL + url,
    });
  },

  postFormWithToken: (url, data) => {
    return axios({
      method: "post",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
        "Content-type": "multipart/form-data",
      },
      url: DevURL + url,
    });
  },

  postwithTokenTest: (url, data) => {
    return axios({
      method: "post",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: url,
    });
  },

  postTest: (url, data) => {
    return axios({
      method: "post",
      data,
      url: url,
    });
  },

  postwithToken: (url, data) => {
    return axios({
      method: "post",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: DevURL + url,
    });
  },

  putwithToken: (url, data) => {
    return axios({
      method: "put",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: DevURL + url,
    });
  },

  putwithTokenTest: (url, data) => {
    return axios({
      method: "put",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: url,
    });
  },

  getwithToken: (url) => {
    return axios({
      method: "get",
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: DevURL + url,
    });
  },

  getwithTokenTest: (url) => {
    return axios({
      method: "get",
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: url,
    });
  },

  getWithoutToken: (url) => {
    return axios({
      method: "get",
      url: url,
    });
  },

  deleteWithToken: (url) => {
    return axios({
      method: "DELETE",
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: DevURL + url,
    });
  },

  patchtwithToken: (url, data) => {
    return axios({
      method: "PATCH",
      data,
      headers: {
        authorization: Bearer + localStorage.getItem(LOCALSTORE.token),
      },
      url: DevURL + url,
    });
  },

  hubConnectionBuilder: (url) => {
    return new HubConnectionBuilder()
    .withUrl(DevURL + url)
    .withAutomaticReconnect()
    .build();
  },
};

export default axoisAPI;
