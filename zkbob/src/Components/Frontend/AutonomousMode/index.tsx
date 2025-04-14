import React, { useEffect, ChangeEvent } from "react";
import "./styles.scss";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { connect, StarknetWindowObject } from '@starknet-io/get-starknet'; 
import { RpcProvider, uint256 } from "starknet";
import { WalletAccount, provider, wallet } from 'starknet'; 
import { AGENT_CONTRACT_ADDRESS } from "@/Components/Backend/Common/Constants";
import { useAgentStore } from "@/store/agent-store";
import { TransacitonsContainer } from "./Transactions.tsx";

const myFrontendProviderUrl = 'https://free-rpc.nethermind.io/sepolia-juno/v0_7';

export const AutonomousAgentInterface=()=>{
    const provider = new RpcProvider({ nodeUrl: process.env.ALCHEMY_API_KEY });
    const [deadline, setDeadline] = useState(new Date());
    const [amount, setAmount]=useState<string>("0.00");
    const [account, setAccount] = useState<WalletAccount | null>(null);
    const [loading, setLoading] = useState(false);

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

    const handleAmountChange = (e:ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/^\$/, '');
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };


   const AddFundsToAgent=async()=>{
       if (!account) {
        alert("Please connect your wallet.");
        return;
       }
       setLoading(true);
       const ETH_ADDRESS="0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
       const cleanAmount = amount.replace(/[^0-9.]/g, "");
       const parsedAmount = parseFloat(cleanAmount);
       const amountInWei = BigInt(Math.floor(parsedAmount * 1e18));
       const amountUint256 = uint256.bnToUint256(amountInWei);

       try {
        const tx = await account.execute([
            {
                contractAddress: ETH_ADDRESS,
                entrypoint: "transfer",
                calldata: [
                    AGENT_CONTRACT_ADDRESS,
                    amountUint256.low.toString(),
                    amountUint256.high.toString()
                ]
            }
        ]);
        console.log("TX hash:", tx.transaction_hash);
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
                <span>100$</span>
                </div>
                <div className="AgentColumn">
                <span >Stop Loss</span>
                <span>30$</span>
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