import BackIcon from '@SVG/buttons/back';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';

export const isOceanSwapOpenAtom = atom<false | 'BFR' | 'USDC' | 'ARB'>(false);
export const OpenOcean = () => {
  const swapAtom = useAtomValue(isOceanSwapOpenAtom);
  const setSwapAtom = useSetAtom(isOceanSwapOpenAtom);
  let tokenName = 'ARB';
  if (swapAtom !== false) {
    tokenName = swapAtom === 'USDC' ? 'USDC.e' : swapAtom;
  }

  return (
    <>
      <ModalBase
        open={swapAtom ? true : false}
        onClose={() => {
          setSwapAtom(false);
        }}
        className=" !px-[0px] !py-[0px] !max-w-[540px] !bg-[#222037] "
      >
        <button
          className="nsm:hidden absolute top-[29px] left-[12px]"
          onClick={() => setSwapAtom(false)}
        >
          <BackIcon />
        </button>
        <iframe
          className=" w-[440px] sm:w-[370px] h-[658px]"
          src={`https://widget.openocean.finance/?chain=arbitrum&fromSymbol=ETH&toSymbol=${tokenName}&amount=1`}
        ></iframe>
      </ModalBase>
    </>
  );
};
