export const getFetchCredentials = (url) => {
  return url.includes('console.aliyun.com') ? 'include' :'omit'
}