export const normalizeId = (id: string) => {
  return id.replace('@', '').replace('/', '-');
}