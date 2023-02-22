import BufferInput from "@Views/Common/BufferInput"
import { useState } from "react"

const AmountSelector: React.FC<any> = ({}) =>{
    const [ amount, setAmount ] = useState('')
  return <BufferInput id="amount" label={<label htmlFor="amount">Ammount</label>} ipClass="w-fit" bgClass="!bg-[#232334]    " className="w-fit" value={amount} onChange={val=>{
    setAmount(val)
  }}
  
  unit={<div>Hello</div>}/>
}

export {AmountSelector}