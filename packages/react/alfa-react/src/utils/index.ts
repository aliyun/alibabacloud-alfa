export const normalizeName = (name: string) => {
  return name.replace(/@/g, '').replace(/\//g, '-');
};
