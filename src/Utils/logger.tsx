export const logger = (logs) => {
  if (import.meta.env.MODE !== 'development') return
  console.log({ logs })
}
