export const wrapSharing = <T>(fn: T, key: string): T => {
  
  try {
    // @ts-ignore
    return  typeof _aliOSKernel === undefined ? fn : (_aliOSKernel && _aliOSKernel[key] ? _aliOSKernel[key] as T : fn)
  } catch {}

  return fn;
}