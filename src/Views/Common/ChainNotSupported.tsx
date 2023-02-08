import { useActiveChain } from "@Hooks/useActiveChain";

export const ChainNotSupported = ({
  supportedChainIds,
  children,
  hide
}: {
  supportedChainIds: number[];
  children: JSX.Element;
  hide?:boolean;
}) => {
  const { activeChain } = useActiveChain();
  if(supportedChainIds.includes(+activeChain.id)) return children;
  if(hide) return <></>
  return (
    <div className="w-[100vw] h-[100vh] grid place-items-center text-f20">
      Sorry this page is not available on {activeChain.name}
    </div>
  );
};



export const ArbitrumOnly = ({children,hide}:{children:JSX.Element,hide?:boolean})=>{
  return <ChainNotSupported supportedChainIds={[42161,421613]} hide={hide}>
    {children}
  </ChainNotSupported>
}