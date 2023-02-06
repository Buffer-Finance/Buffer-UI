import axiosInstance from "@Config/axios";
import * as Sentry from "@sentry/browser";
import axiosRetry from "axios-retry";

const getApi: (
  url: string,
  body?: any,
  ...overrides: any
) => Promise<[any, any]> = async (url: string, body?: any, ...overrides) => {
  try {
    const secondArg = body
      ? {
          params: body,
          ...overrides,
        }
      : {};
    const res = await axiosInstance.get(url, secondArg);
    return [res.data.data, null];
  } catch (err) {

    return [null, err];
  }
};
const postRes: (url: string, body?: any) => Promise<[any, any]> = async (
  url: string,
  body: any
) => {
  axiosRetry(axiosInstance, {
    retries: 5,
    retryDelay: (retryCount) => {
      return 1000;
    },
    retryCondition: (error) => {
      // if retry condition is not specified, by default idempotent requests are retried
      return true;
    },
  });

  try {
    const res = await axiosInstance.post(url, body);
    return [res.data, null];
  } catch (err) {
    return [null, err];
  }
};
const getRes: (url: string, overrides?: any) => Promise<[any, any]> = async (
  url: string,
  overrides: {
    signal: any;
    timeout: any;
    params: any;
  }
) => {
  axiosRetry(axiosInstance, {
    retries: 5,
    retryDelay: (retryCount) => {
      return 1000;
    },
    retryCondition: (error) => {
      // if retry condition is not specified, by default idempotent requests are retried
      return true;
    },
  });

  try {
    const res = await axiosInstance({
      method: "GET",
      signal: overrides?.signal,
      params: overrides?.params,
      timeout: overrides?.timeout,
      url,
    });
    return [res.data, null];
  } catch (err) {

    return [null, err];
  }
};
const getApiv2: (
  url: string,
  body?: any,
  ...overrides: any
) => Promise<[any, any]> = async (url: string, body: any, ...overrides) => {
  try {
    const secondArg = body
      ? {
          params: body,
          ...overrides,
        }
      : {};
    const res = await axiosInstance.get(url, secondArg);
    return [res.data.data, null];
  } catch (err) {
    return [null, err];
  }
};
const postApi: (
  url: string,
  body: any,
  params: any
) => Promise<[any, any]> = async (url, body, params) => {
  try {
    const res = await axiosInstance.post(url, body, { params });
    return [res.data.data, null];
  } catch (err) {
    return [null, err];
  }
};
export { getApi, postApi, getApiv2, getRes, postRes };
