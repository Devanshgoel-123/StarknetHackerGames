import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import Image from "next/image";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Drawer } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { SocialComponent } from "./Social";
import "./styles.scss";
import { IoMdAdd } from "react-icons/io";
import { useAgentStore } from "@/store/agent-store";
import { useShallow } from "zustand/react/shallow";
import { MessageSquare, BarChart3, PieChart, Wallet2, Copy } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { BACKEND_URL, DAPP_LOGO } from "@/Components/Backend/Common/Constants";
import axios from "axios";

export const handleConnect = async () => {
  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", `_blank`);
    }
  };
  const wallet = getAptosWallet();
  try {
    console.log("Attempting to connect to Petra...");
    const response = await wallet.connect();
    const account = await wallet.account();
    useAgentStore.getState().setWalletAddress(account.address.toString());
    const agentResponse=await axios.post(`${BACKEND_URL}/walletRouter`,{
        walletAddress:account.address.toString()
    })
    useAgentStore.getState().setAgentWalletAddress(agentResponse.data.agentWalletAddress)
    useAgentStore.getState().setAgentKey(agentResponse.data.key)
  } catch (error) {
    console.log(error);
  }
};

export const Sidebar = () => {
  const { disconnect } = useWallet();
  const isMobile = useMediaQuery("(max-width: 600px)");
  const {
     openSidebar, 
     activeComponent, 
     walletAddress,
     agentWalletAddress
    } = useAgentStore(
    useShallow((state) => ({
      openSidebar: state.openSideBar,
      activeComponent: state.activeComponent,
      walletAddress: state.walletAddress,
      agentWalletAddress:state.agentWalletAddress
    }))
  );

  const [active, setActive] = useState<string>("chat");
  const [copied, setCopied] = useState(false);
  const { 
    openArena
   } = useAgentStore(
    useShallow((state) => ({
      openArena: state.openArena,
    }))
  );

 

  
  const getAptosWallet = () => {
    if ("aptos" in window) {
      return window.aptos;
    } else {
      window.open("https://petra.app/", `_blank`);
    }
  };
  

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(agentWalletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleDisconnect = async () => {
    const wallet = getAptosWallet();
    try {
      await wallet.disconnect();
      useAgentStore.getState().setWalletAddress("");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    }
  };

  const menuItems = [
    { id: "price", label: "Market Analysis", icon: <BarChart3 size={18} /> },
    { id: "portfolio", label: "Portfolio", icon: <PieChart size={18} /> },
    { id: "yield", label: "Yield Finder", icon: <PieChart size={18} /> },
  ];
  if (isMobile) {
    return (
      <Drawer open={openSidebar}>
        <div className="SideBarWrapper">
          <div className="TopContainer">
            <div className="SideBarHeader">
              <RxCross1
                className="crossIcon GradientText"
                onClick={() => useAgentStore.getState().setOpenSideBar(false)}
              />
              <Image
                src={DAPP_LOGO}
                height={25}
                width={25}
                alt="logo"
                className="SideBarLogo"
              />
              <span className="HeadingTextSidebar">DeFiZen</span>
            </div>
            <div className="sidebar-menu">
              <div
                key={"chat"}
                className={
                  activeComponent === "chat"
                    ? "sidebar-menu-item active"
                    : "sidebar-menu-item"
                }
                onClick={() =>
                  useAgentStore.getState().setActiveComponent("chat")
                }
              >
                <div className="sidebar-menu-icon">
                  <MessageSquare size={18} />
                </div>
                <span className="sidebar-menu-label">Chat</span>
                <div
                  className="sidebar-menu-icon"
                  onClick={() => {
                    useAgentStore.getState().setActiveChatId();
                    useAgentStore.getState().setOpenSideBar(false);
                    if (!openArena) {
                      useAgentStore.getState().handleOpenArena();
                    }
                  }}
                >
                  <IoMdAdd />
                </div>
              </div>
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={
                    activeComponent === item.label
                      ? "sidebar-menu-item active"
                      : "sidebar-menu-item"
                  }
                  onClick={() => {
                    console.log("Setting label as", item.label);
                    useAgentStore.getState().setOpenSideBar(false);
                    if(agentWalletAddress!==""){
                      useAgentStore.getState().setActiveComponent(item.label);
                    }
                   
                  }}
                >
                  <div className="sidebar-menu-icon">{item.icon}</div>
                  <span className="sidebar-menu-label">{item.label}</span>
                </div>
              ))}
              <div className="WalletContainer">
             <span className="walletName">User Wallet</span>
              <div
                className="sidebar-menu-item wallet-connect"
                onClick={walletAddress ? handleDisconnect : handleConnect}
              >
                <div className="sidebar-menu-icon">
                  <Wallet2 size={18} />
                </div>

                {walletAddress ? (
                  <span className="wallet-address">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                ) : (
                  <span className="sidebar-menu-label">Connect Wallet</span>
                )}
              </div>
              <span className="walletName">Agent Wallet</span>
              <div
                className="sidebar-menu-item wallet-connect"
              >
                <div className="sidebar-menu-icon">
                  <Wallet2 size={18} />
                </div>
                {agentWalletAddress ? (
                  <span className="wallet-address">
                    {agentWalletAddress.slice(0, 6)}...{agentWalletAddress.slice(-4)}
                  </span>
                ) : (
                  <span className="sidebar-menu-label">0x0000...0000</span>
                )}
              </div>
              {agentWalletAddress && (
                <div
                  className="copy-button"
                  onClick={handleCopyAddress}
                >
                 <Copy size={16} /> {copied ? "Copied!" : "Copy Address"}
                </div>
              )}
              </div>
             
            </div>
          </div>
          <SocialComponent />
        </div>
      </Drawer>
    );
  }

  return (
    <Box className="SideBarWrapper">
      <div className="TopContainer">
        <div className="SideBarHeader">
          <Image
            src={DAPP_LOGO}
            height={25}
            width={25}
            alt="logo"
            className="SideBarLogo"
          />
          <span className="HeadingTextSidebar">DeFiZen</span>
        </div>

        <div className="sidebar-menu">
          <div
            key={"chat"}
            className={
              activeComponent === "chat"
                ? "sidebar-menu-item active"
                : "sidebar-menu-item"
            }
            onClick={() => {
              useAgentStore.getState().setActiveComponent("chat");
            }}
          >
            <div className="sidebar-menu-icon">
              <MessageSquare size={18} />
            </div>
            <span className="sidebar-menu-label">Chat</span>
            <div
              className="sidebar-menu-icon"
              onClick={() => {
                useAgentStore.getState().clearCurrentValues();
                useAgentStore.getState().setActiveChatId();
                if (!openArena) {
                  useAgentStore.getState().handleOpenArena();
                }
              }}
            >
              <IoMdAdd />
            </div>
          </div>

          {menuItems.map((item) => (
            <div
              key={item.id}
              className={
                activeComponent === item.label
                  ? "sidebar-menu-item active"
                  : "sidebar-menu-item"
              }
              onClick={() => {
                useAgentStore.getState().setOpenSideBar(false);
                if(agentWalletAddress!==""){
                  useAgentStore.getState().setActiveComponent(item.label);
                }
              }}
            >
              <div className="sidebar-menu-icon">{item.icon}</div>
              <span className="sidebar-menu-label">{item.label}</span>
            </div>
          ))}

         <div className="WalletContainer">
         <span className="walletName">User  Wallet</span>
         <div
            className="sidebar-menu-item wallet-connect"
            onClick={walletAddress ? handleDisconnect : handleConnect}
          >
            <div className="sidebar-menu-icon">
              <Wallet2 size={18} />
            </div>
            {walletAddress ? (
              <div className="wallet">
                <span className="wallet-address">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-2)}
                </span>
              </div>
            ) : (
              <span className="sidebar-menu-label">Connect Wallet</span>
            )}
          </div>
          <span className="walletName">Agent  Wallet</span>
          <div
            className="sidebar-menu-item wallet-connect"
          >
            <div className="sidebar-menu-icon">
              <Wallet2 size={18} />
            </div>
            {agentWalletAddress ? (
              <div className="wallet">
                <span className="wallet-address">
                  {agentWalletAddress.slice(0, 6)}...{agentWalletAddress.slice(-2)}
                </span>
              </div>
            ) : (
              <span className="sidebar-menu-label">0x0000...0000</span>
            )}
          </div>
          {agentWalletAddress && (
                <div
                  className="copy-button"
                  onClick={handleCopyAddress}
                >
                 <Copy size={16} /> {copied ? "Copied!" : "Copy Address"}
                </div>
              )}
         </div>
          
        </div>
      </div>

      <SocialComponent />
    </Box>
  );
};
