import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { downloadGetLink, getNodeSnapshot, uploadImage } from '@Utils/DOMutils';
import ButtonLoader from '@Views/Common/V2-Button/ButtonLoader';
import { useUserCode } from '@Views/Referral/Hooks/useUserCode';
import { TradeType, marketType } from '@Views/ABTradePage/type';
import { ContentCopy, FileDownloadOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useCopyToClipboard } from 'react-use';

export const apiBaseUrl = 'https://share.buffer.finance';

export const ShareButtons: React.FC<{
  imageRef: React.RefObject<HTMLDivElement>;
  market: marketType;
  trade: TradeType;
}> = ({ imageRef, market, trade }) => {
  const [loading, setLoading] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const toastify = useToast();

  const { activeChain } = useActiveChain();
  const { affiliateCode } = useUserCode(activeChain);
  const isCodeSet = !!affiliateCode;

  const uploadToServer = async () => {
    setLoading(true);
    const image = await getNodeSnapshot(imageRef.current);
    const imageInfo = await uploadImage(image);
    setLoading(false);
    toastify({
      type: 'success',
      msg: "Copied! Your trade's image will be ready in ~10s",
    });
    let url = `${apiBaseUrl}/api/position?id=${imageInfo.public_id}`;
    if (isCodeSet) url = `${url}&ref=${affiliateCode}`;
    copyToClipboard(url);
  };

  const downloadImage = async () => {
    const image = await getNodeSnapshot(imageRef.current);
    downloadGetLink(
      image,
      market.token0 +
        '-' +
        market.token1 +
        '|' +
        (trade.is_above ? 'Up' : 'Down')
    );
  };

  return (
    <div className="flex sm:justify-start items-stretch mt-4 gap-3 ">
      <button
        className={`text-f16 text-3 bg-2 pb-[3px] pr-4 pl-[10px] rounded-sm h-[30px] whitespace-nowrap w-[80px] transition-all duration-300 hover:text-1`}
        onClick={uploadToServer}
      >
        {loading ? (
          <CircularProgress
            className="!w-[15px] mt-[5px] !h-[15px] mx-[15px]  origin-center"
            color="inherit"
          />
        ) : (
          <>
            <ContentCopy />
            <span className="ml-3 pb-1">Copy</span>
          </>
        )}
      </button>
      <button
        className={`text-f16 text-3 bg-2 pb-[3px] pr-4 pl-[10px] h-[30px] rounded-sm whitespace-nowrap transition-all duration-300 hover:text-1 `}
        onClick={downloadImage}
      >
        <FileDownloadOutlined />
        <span className="ml-3 pb-1">Download</span>
      </button>
    </div>
  );
};
