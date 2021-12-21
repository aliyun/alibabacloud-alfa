export const isSSR = () => {
  return typeof document === 'undefined'
}
