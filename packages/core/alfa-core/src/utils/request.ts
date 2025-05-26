import axios from 'axios';

import requestInterceptor from './interceptors/requestInterceptor';
import networkErrorInterceptor from './interceptors/networkErrorInterceptor';
import responseInterceptor from './interceptors/responseInterceptor';

const instance = axios.create();

instance.interceptors.request.use(requestInterceptor, undefined);
instance.interceptors.response.use(undefined, networkErrorInterceptor);
instance.interceptors.response.use(responseInterceptor, undefined);
instance.interceptors.response.use(undefined, networkErrorInterceptor);

export default instance;
