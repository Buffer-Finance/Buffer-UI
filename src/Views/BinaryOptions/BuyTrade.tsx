import { useAtom } from "jotai";
import { AmountSelector, DurationSelector } from "./AmountSelector"
import { useBinaryActions } from "./Hooks/useBinaryActions";
import { ammountAtom } from "./PGDrawer";
import { DurationPicker } from "./PGDrawer/DurationPicker";

const BuyTrade: React.FC<any> = ({}) =>{
  const [amount, setAmount] = useAtom(ammountAtom);
  const {
    handleApproveClick,
    buyHandler,
    loading,
    currStats,
    activeAssetState,
  } = useBinaryActions(amount, true, true);

  return <div>
    <div className="flex">
   {activeAssetState && <AmountSelector {...{amount,setAmount,activeAssetState}}/>}
   {activeAssetState && <DurationSelector {...{amount,setAmount,activeAssetState}}/>}
    {/* <AmountSelector /> */}
    {/* <DurationPicker /> */}
    </div>
    Lets buy spme trades</div>
}

export {BuyTrade}