import { ethers } from "ethers";
const MAX_REFERRAL_CODE_LENGTH = 45;
export function encodeReferralCode(code) {
  let final = code.replace(/[^\w_]/g, ""); // replace everything other than numbers, string  and underscor to ''
  if (final.length > MAX_REFERRAL_CODE_LENGTH) {
    return ethers.constants.HashZero;
  }
  return ethers.utils.formatBytes32String(final);
}
