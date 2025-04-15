import { useMediaQuery } from "@mui/material";
import "./styles.scss";
import React, { use, useState } from "react";
import axios from "axios";
import { DepositWithdrawPool } from "@/Components/Backend/Types";
import { BACKEND_URL } from "@/Components/Backend/Common/Constants";
import { useAgentStore } from "@/store/agent-store";
import Image from "next/image";
import { useShallow } from "zustand/react/shallow";
type MarketContainerProps = {
  data: DepositWithdrawPool;
}

const MarketContainer: React.FC<MarketContainerProps> = ({ data}:MarketContainerProps) => {
  const [amount, setAmount] = useState<number>(0.00);
  const MobileDevice = useMediaQuery("(max-width:600px)");   


  const {
    agentWalletAddress
  }=useAgentStore(useShallow((state)=>({
    agentWalletAddress:state.agentWalletAddress
  })))
  const handleEnterClick=async (value:string)=>{
    try{
     if(amount>0){
      useAgentStore.getState().setYieldAgentFetching(true)
      console.log(`I want to ${value} ${amount} ${data.tokenName} on the ${data.protocol}`)
      useAgentStore.getState().setActiveYieldChat(`I want to ${value} ${amount} ${data.tokenName} on the ${data.protocol}`)
      const response=await axios.post(`${BACKEND_URL}/depositWithdraw/agent`,{
        messages:[{
         role:"user",
        content:`I want to ${value} ${amount} ${data.tokenName} on the ${data.protocol}`
        }],
        address:agentWalletAddress
      })
      console.log(response.data)
      useAgentStore.getState().setActiveYieldResponse({
        analysis:response.data.message.finalResponse
      })
      useAgentStore.getState().setYieldChats({
        query:`I want to ${value} ${amount} ${data.tokenName} on the ${data.protocol}`,
        response:{
          analysis:response.data.message.finalResponse
        }
      })
    }
    }catch(err){
      useAgentStore.getState().setActiveYieldResponse({
        analysis: "Sorry We couldn't process your request at the moment",
        recommendedAction: "",
      });
      console.log(err)
    }
  }

  return (
    <div className={`deposit-form ${MobileDevice ? "mobile" : ""}`}>
      <div className="header">
        <span className="market-cap">
           <Image src={data.protocolImage} height={30} width={30} alt="protocolImage" className="protocolImage"/>
           {/* <span >{data.protocol}</span> */}
           <span>{data.poolName}</span>
        </span>
       
        <span className="market-cap">
       
        <Image src={data.tokenImage} height={30} width={30} alt="protocolImage" className="protocolImage"/>
          {data.tokenName.toUpperCase()}
          <span className="market-cap">{data.apy}</span>
          </span>

      </div>

      <div className="form-container">
        <input
          type="number"
          placeholder="Amount"
          value={amount === 0 ? "" : amount}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || Number(value) >= 0) {
              setAmount(Number(value));
            }
          }}
          className="amount-input"
        />
        <button className="stake-btn" onClick={()=>{handleEnterClick("deposit")}}>Deposit</button>
        <button className="unstake-btn" onClick={()=>{handleEnterClick("withdraw")}}>Withdraw</button>
      </div>
    </div>
  );
};

export default MarketContainer;
