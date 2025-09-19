export const generateUuid = () => {
  return Math.floor(Math.random() * Date.now()).toString(36)
}
