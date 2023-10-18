export function affilateCode2ReferralLink(affiliateCode: string | null) {
  if (!affiliateCode) return '#';
  const { hostname } = window.location;
  const link = `https://${hostname}/#/ref/${affiliateCode}/`;
  return link;
}
