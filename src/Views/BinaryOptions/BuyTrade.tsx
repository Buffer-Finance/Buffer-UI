import { AmountSelector } from "./AmountSelector"

const BuyTrade: React.FC<any> = ({}) =>{
  return <div>
    <div className="flex">
    <AmountSelector />
    <AmountSelector />
    </div>
    Lets buy spme trades</div>
}

export {BuyTrade}