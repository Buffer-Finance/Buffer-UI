import { IMarket } from "@Views/BinaryOptions";

export function getFavouriteKey(
  asset: IMarket,
  account: string,
  chain: string
) {
  if (!chain) return;
  return `${asset.tv_id}-${account}-${chain}-v1`;
}
