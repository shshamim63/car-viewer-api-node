export const formatResponse = (message: string) => {
  return {
    message: message,
    version: process.env.APP_VERSION
  }
}