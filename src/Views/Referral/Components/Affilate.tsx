import { useActiveChain } from '@Hooks/useActiveChain';
import BufferInput from '@Views/Common/BufferInput';
import { ContentCopy } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { useUserCode } from '../Hooks/useUserCode';
import { affilateCode2ReferralLink } from '../Utils/affiliateCode2RederralLink';
import { DataCard } from './DataCard';
import PlainCard from './PlainCard';

export const Affilate = ({
  affiliateBoxArr,
  inputValue,
  setInput,
  btn,
}: {
  affiliateBoxArr: { header: string; desc: JSX.Element }[];
  btn: ReactNode;
  inputValue: string;
  setInput: (value: string) => void;
}) => {
  const { activeChain } = useActiveChain();
  const { affiliateCode } = useUserCode(activeChain);
  const isCodeSet = !!affiliateCode;
  const [state, copyToClipboard] = useCopyToClipboard();
  const [open, setOpen] = useState(false);
  const link = affilateCode2ReferralLink(affiliateCode);
  const copyLink = () => {
    try {
      copyToClipboard(link);
      setOpen(true);
    } catch (err) {
      setOpen(false);
    }
  };

  // console.log(`index-affiliateCode: `, affiliateCode);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setOpen(false);
      }, 4000);
    }
  }, [open]);
  return (
    <>
      <div className="flex justify-center gap-4 mt-6 sm:flex-wrap">
        {isCodeSet &&
          affiliateBoxArr?.map((singleData, index: number) => (
            <DataCard
              desc={singleData.desc}
              header={singleData.header}
              key={index}
            />
          ))}
      </div>

      <PlainCard.Container className="w-[440px] mt-6 nsm:py-6 tb:px-8 m-auto sm:mt-4">
        <PlainCard.Header>
          {isCodeSet ? 'Copy your Referral Link' : 'Share your Referral Code'}
        </PlainCard.Header>
        {!isCodeSet && (
          <PlainCard.Description className="mb-3">
            Looks like you dont have any referral to share. Create one now and
            start earning.
          </PlainCard.Description>
        )}
        <BufferInput
          value={isCodeSet ? affiliateCode : inputValue}
          isDisabled={isCodeSet}
          bgClass={'!pr-[6px]'}
          unit={
            isCodeSet ? (
              <Tooltip
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                title="Copied"
                placement="top"
                disableFocusListener
                disableHoverListener
                disableTouchListener
                classes={{
                  tooltip: 'tooltip',
                  arrow: 'arrow',
                }}
              >
                <button onClick={copyLink} className="bg-blue p-3 rounded">
                  <ContentCopy />
                </button>
              </Tooltip>
            ) : (
              <></>
            )
          }
          onChange={setInput}
          className="bg-5 ip-border "
          placeholder="Enter your code"
        />
        {!isCodeSet && btn}
      </PlainCard.Container>
    </>
  );
};
