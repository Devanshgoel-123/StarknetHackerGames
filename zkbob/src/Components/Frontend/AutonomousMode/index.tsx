import React, { useEffect, ChangeEvent } from "react";
import "./styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { connect, StarknetWindowObject } from '@starknet-io/get-starknet'; 
import { RpcProvider, uint256 } from "starknet";
import { WalletAccount, provider, wallet } from 'starknet'; 
import { AGENT_CONTRACT_ADDRESS, BACKEND_URL } from "@/Components/Backend/Common/Constants";
import { useAgentStore } from "@/store/agent-store";
import { TransacitonsContainer } from "./Transactions.tsx";
import axios from "axios";
import { useShallow } from "zustand/react/shallow";


export const AutonomousAgentInterface=()=>{
    const provider = new RpcProvider({ nodeUrl: process.env.ALCHEMY_API_KEY });
    const [deadline, setDeadline] = useState(new Date());
    const [amount, setAmount]=useState<string>("0.00");
    const [stopLoss, setStopLoss]=useState<string>("0.00");
    const [account, setAccount] = useState<WalletAccount | null>(null);
    const [loading, setLoading] = useState(false);
    const [totalAmount,setTotalAmount]=useState<number>(0);
    const [totalstopLoss,setTotalStopLoss]=useState<number>(0);
    const [holding,setHoldingUsd]=useState<number>(0);
    const [profit,setProfit]=useState<string>("0.00"); 
    const {
        userWalletAddress
    }=useAgentStore(useShallow((state)=>({
        userWalletAddress:state.walletAddress
    })))
    
   useEffect(()=>{
    const agentHoldings=async()=>{
        try{
            const data=await axios.get(`${BACKEND_URL}/userPortfolio/agentTotal`,{
                params:{
                    agentWalletAddress:AGENT_CONTRACT_ADDRESS
                }
            })
            const agentData=data.data;
            console.log(data.data)
            setHoldingUsd(agentData.totalHoldings)
            setTotalStopLoss(agentData.stopLoss)
            setTotalAmount(agentData.totalAmount)
        }catch(err){
            console.log("error is there fetching agent total",err)
        }
    }
    agentHoldings()
   },[])

    useEffect(()=>{
        const handleConnect = async () => {
            try {
                const selectedWalletSWO = await connect({ modalMode: 'alwaysAsk', modalTheme: 'dark' });
                
                if (!selectedWalletSWO || !selectedWalletSWO.id) {
                    console.error("Wallet not connected");
                    return;
                }
                
                const myWalletAccount = await WalletAccount.connect(
                    provider,
                    selectedWalletSWO
                );
                setAccount(myWalletAccount);
            } catch (error) {
                console.error("Connection failed:", error);
                alert("Failed to connect wallet.");
            }
        };
        
        handleConnect();
    },[]);

    useEffect(() => {
        if (account) {
            useAgentStore.getState().setWalletAddress(account.address);
            console.log("Setting wallet in store:", account.address);
        }
    }, [account]);

   const AddFundsToAgent=async()=>{
       if (!account) {
        alert("Please connect your wallet.");
        return;
       }
       if(stopLoss==="0.00"){
        alert("Please Enter some stop loss.");
        return
       }
       setLoading(true);
       const strkAddress="0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
       const cleanAmount = amount.replace(/[^0-9.]/g, "");
       const parsedAmount = parseFloat(cleanAmount);
       const amountInWei = BigInt(Math.floor(parsedAmount * 1e18));
       const amountUint256 = uint256.bnToUint256(amountInWei);
       try {
        const tx = await account.execute([
            {
                contractAddress: strkAddress,
                entrypoint: "transfer",
                calldata: [
                    AGENT_CONTRACT_ADDRESS,
                    amountUint256.low.toString(),
                    amountUint256.high.toString()
                ]
            }
        ]);
        console.log("TX hash:", tx.transaction_hash);
        const result=await axios.post(`${BACKEND_URL}/autonomous/createDeposit`,{
            agentWallet:AGENT_CONTRACT_ADDRESS, 
            userWallet:userWalletAddress, 
            amount:amount, 
            stopLoss:stopLoss, 
            expectedProfit:profit,
            deadline:deadline
        })
        alert("Transaction sent!");
    } catch (err) {
        console.error("Transaction failed:", err);
        alert("Failed to transfer funds. ");
    } finally {
        setLoading(false);
    }
   }


    return (
        <div className="AutonomousInterface">
            <div className="AgentInformation">
                <div className="AgentColumn">
                    <span>Name</span>
                    <span>Defizen</span>
                </div>
                <div className="AgentColumn">
                <span>Balance Locked</span>
                <span>${totalAmount}</span>
                </div>
                <div className="AgentColumn">
                <span >Agent Stop Loss</span>
                <span>${totalstopLoss}</span>
                </div>
                <div className="AgentColumnFunds">
                <button
                onClick={AddFundsToAgent}
                disabled={loading}
                className="AddFundsButton"
                >Add Funds
                </button>
                <div className='Input'>
                  <input
                    className='InputField'
                    type='text'
                    value={`${amount}`}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                 </div>
                </div>
                <div className="AgentColumnFunds">
                <div
                className="AddFundsButton"
                >Set Stop Loss
                </div>
                <div className='Input'>
                  <input
                    className='InputField'
                    type='text'
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                 </div>
                </div>
                <div className="AgentColumnFunds">
                <div
                className="AddFundsButton"
                >Set Profit Level
                </div>
                <div className='Input'>
                  <input
                    className='InputField'
                    type='text'
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    required
                    placeholder="0.00"
                  />
                 </div>
                </div>
                <div className="AgentColumn">
                <span >Deadline</span>
                <div className="DatePicker">
                <DatePicker
                    showTimeSelect
                    onChange={(value) => setDeadline(value as Date)}
                    selected={deadline}
                    locale="es"
                    fixedHeight
            />
                </div>
                  
              </div>
            </div>
            <TransacitonsContainer/>
        </div>
    )
}