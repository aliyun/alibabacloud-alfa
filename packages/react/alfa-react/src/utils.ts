export const normalizeName = (name: string) => {
  return name.replace(/@/g, '').replace(/\//g, '-');
}

export const isSSR = () => {
  return typeof document === 'undefined'
}
