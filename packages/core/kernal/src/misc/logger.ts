export enum ErrorType {
  manifest = 'manifest',
  performance = 'performance',
  error = 'error',
  api = 'api'
}

interface OSError<T = any> {
  type: ErrorType;
  error: Error;
  meta?: T;
}

const loggerFactory = (type: ErrorType) => {
  return <T>(error: Error, meta: T): OSError => {
    return {
      type: type,
      error: error,
      meta: meta
    }
  }
}

export const LoggerFactory = {
  manifest: loggerFactory(ErrorType.manifest),
  api: loggerFactory(ErrorType.api),
  error: loggerFactory(ErrorType.error),
  performance: loggerFactory(ErrorType.performance),
}