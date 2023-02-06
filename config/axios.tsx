import axios from "axios";

export const cancelTokenObjectProducer = (calledFrom = "NEW NEW NEW") => {
  const { CancelToken } = axios;
  const source = CancelToken.source();
  return {
    ...source,
  };
};

export const axiosInstance = axios.create({
  baseURL: "https://api-v2.buffer.finance",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 40000,
});

axiosInstance.interceptors.response.use(
  (req) => {
    let newResp: any = {
      ...req,
    };
    if (req.data && req.data.data && req.data.data.error) {
      newResp = {
        ...req,
        error: req.data.data.error.message,
        status: req.data.data.error.code,
      };
    }
    return Promise.resolve(newResp);
  },
  (error) => {
    return Promise.reject(error);
  }
);

export function setAuthorizationToken(user: any) {
  if (user) {
    axiosInstance.defaults.headers.common[
      "session-token"
    ] = `${user.session_token}`;
  } else {
    delete axiosInstance.defaults.headers.common["session-token"];
  }
}

export default axiosInstance;
