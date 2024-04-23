import { useActiveChain } from '@Hooks/useActiveChain';
import Missing from './Missing';
import { optimism } from 'viem/dist/types/chains';

export const ChainNotSupported = ({
  supportedChainIds,
  children,
  hide,
}: {
  supportedChainIds: number[];
  children: JSX.Element;
  hide?: boolean;
}) => {
  const { activeChain } = useActiveChain();
  if (supportedChainIds.includes(+activeChain.id)) return children;
  if (hide) return <></>;
  return (
    <div className="w-[100vw] h-[100vh] grid place-items-center text-f20">
      <Missing
        onClick={
          (e) => {}
          // idx === 5 ? redirectChain("AURORA") : redirectChain("BSC")
        }
        paddingTop="7%"
      ></Missing>{' '}
    </div>
  );
};

export const ArbitrumOnly = ({
  children,
  hide,
}: {
  children: JSX.Element;
  hide?: boolean;
}) => {
  return (
    <ChainNotSupported supportedChainIds={[42161, 421613]} hide={hide}>
      {children}
    </ChainNotSupported>
  );
};

export const ExceptArbitrum = ({
  children,
  hide,
}: {
  children: JSX.Element;
  hide?: boolean;
}) => {
  return (
    <ChainNotSupported supportedChainIds={[11155420, optimism.id]} hide={hide}>
      {children}
    </ChainNotSupported>
  );
};
