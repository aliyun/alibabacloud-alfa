export const normalizeId = (id: string, version?: string) => {
  return `${id.replace('@', '').replace('/', '-')}${version ? '_' : ''}${version?.replace(/\./g, '_') || ''}`;
};

