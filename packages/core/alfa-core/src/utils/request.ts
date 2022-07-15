import axios from 'axios';

import networkErrorInterceptor from './interceptors/networkErrorInterceptor';
import responseInterceptor from './interceptors/responseInterceptor';
import requestInterceptor from './interceptors/requestInterceptor';

const instance = axios.create();

instance.interceptors.response.use(undefined, networkErrorInterceptor);
instance.interceptors.response.use(responseInterceptor, undefined);
instance.interceptors.response.use(undefined, networkErrorInterceptor);

export default instance;
