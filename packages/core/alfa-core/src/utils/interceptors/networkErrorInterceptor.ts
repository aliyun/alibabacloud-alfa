import axios, { AxiosError } from 'axios';

// only handle network error, and retry request
export default async function responseErrorInterceptor(error: AxiosError) {
  if (!axios.isAxiosError(error)) throw error;

  const { config } = error;

  let response = {
    status: 404,
    statusText: 'NetworkError',
    headers: error?.response?.headers,
    config,
    data: null,
  };

  try {
    response = await axios(config);
  } catch (e) {
    // ...
  }

  return response;
}
