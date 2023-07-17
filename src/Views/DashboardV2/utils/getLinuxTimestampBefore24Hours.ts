export function getLinuxTimestampBefore24Hours() {
  return Math.floor((Date.now() - 24 * 60 * 60 * 1000) / 1000);
}
