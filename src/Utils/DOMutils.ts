import { apiBaseUrl } from '@Views/ABTradePage/Views/AccordionTable/ShareModal/ShareButtons';
import { toPng } from 'html-to-image';
export interface ICloudanaryRes {
  asset_id: string;
  public_id: string;
  version: number;
  version_id: string;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: any[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: false;
  url: string;
  secure_url: string;
  folder: string;
  api_key: string;
}
// const config = {
//   quality: 0.97,
//   canvasWidth: 620,
//   canvasHeight: 420,
// };
const config = { quality: 0.95, canvasWidth: 600, canvasHeight: 315 };

export async function uploadImage(image): Promise<ICloudanaryRes> {
  return await fetch(apiBaseUrl + '/api/upload', {
    method: 'POST',
    body: image,
  }).then((res) => res.json());
}

export async function getNodeSnapshot(node) {
  const rawImage = await toPng(node, config);
  return rawImage;
}

export const downloadGetLink = (dataUrl, name) => {
  const link = document.createElement('a');
  link.download = `${name}.jpeg`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
};
