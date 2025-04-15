import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Image from "next/image";
import { Drawer } from "@mui/material";
import { RxCross1 } from "react-icons/rx";
import { SocialComponent } from "./Social";
import "./styles.scss";
import { IoMdAdd } from "react-icons/io";
import { useAgentStore } from "@/store/agent-store";
import { useShallow } from "zustand/react/shallow";
import { MessageSquare, BarChart3, PieChart, Wallet2, Copy, Loader2, ExternalLink, Check } from "lucide-react";
import { useMediaQuery } from "@mui/material";
import { DAPP_LOGO } from "@/Components/Backend/Common/Constants";
import axios from "axios";
import { useConnect, useDisconnect, useAccount, Connector } from "@starknet-react/core";
import { StarknetkitConnector, useStarknetkitConnectModal } from "starknetkit";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const {
    openSidebar,
    activeComponent,
    agentWalletAddress
  } = useAgentStore(
    useShallow((state) => ({
      openSidebar: state.openSideBar,
      activeComponent: state.activeComponent,
      agentWalletAddress: state.agentWalletAddress
    }))
  );

  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as StarknetkitConnector[]
  });

  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  
  const { 
    openArena
  } = useAgentStore(
    useShallow((state) => ({
      openArena: state.openArena,
    }))
  );

  // Clear status message after delay
  useEffect(() => {
    if (showStatus) {
      const timer = setTimeout(() => {
        setShowStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showStatus]);

  const showStatusMessage = (message: React.SetStateAction<string>) => {
    setStatusMessage(message);
    setShowStatus(true);
  };

  // Format address for display
  const formatAddress = (addr: string | any[]) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  async function handleConnect() {
    try {
      setIsConnecting(true);
      const { connector } = await starknetkitConnectModal();
      if (!connector) {
        setIsConnecting(false);
        return;
      }
      
      connect({ connector: connector as Connector });
      console.log("Wallet connected successfully");
      showStatusMessage("Wallet connected successfully");
      console.log(address)
      if (address!==undefined) {
        console.log("the address is",address)
        useAgentStore.getState().setAgentWalletAddress(address)
        // try {
        //   const agentResponse = await axios.post(`${process.env.BACKEND_URL || ''}/walletRouter`, {
        //     walletAddress: address
        //   });
          
        //   useAgentStore.getState().setAgentWalletAddress(agentResponse.data.agentWalletAddress);
        //   useAgentStore.getState().setAgentKey(agentResponse.data.key);
        // } catch (error) {
        //   console.error("Error fetching agent wallet:", error);
        // }
      }
    } catch (error) {
      console.error("Connection failed:", error);
      showStatusMessage("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }


  useEffect(() => {
    if (isConnected && address) {
      console.log("the address is", address);
      useAgentStore.getState().setAgentWalletAddress(address);
    }
  }, [address, isConnected]);

  const handleDisconnect = async () => {
    try {
      await disconnect();
      useAgentStore.getState().setWalletAddress("");
      console.log("Wallet disconnected successfully");
      showStatusMessage("Wallet disconnected");
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      showStatusMessage("Failed to disconnect wallet");
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(agentWalletAddress);
    setCopied(true);
    showStatusMessage("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // View transaction history
  const viewTransactions = () => {
    if (address) {
      window.open(`https://starkscan.co/contract/${address}`, '_blank');
    }
  };

  const menuItems = [
    { id: "portfolio", label: "Portfolio", icon: <PieChart size={18} /> },
    { id: "yield", label: "Yield Finder", icon: <PieChart size={18} /> },
    {id: "autonomous", label : "Autonomous Mode",icon: <PieChart size={18} /> },
    {id: "contacts", label : "Contacts",icon: <PieChart size={18} /> }
  ];
  
  const StatusMessage = () => (
    <div className={`status-message ${showStatus ? 'show' : ''}`}>
      {statusMessage}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={openSidebar}>
        <div className="SideBarWrapper">
          {showStatus && <StatusMessage />}
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
                    // if(agentWalletAddress !== ""){
                      useAgentStore.getState().setActiveComponent(item.label);
                    // }
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
                  onClick={isConnected ? handleDisconnect : handleConnect}
                >
                  <div className="sidebar-menu-icon">
                    {isConnecting ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      <Wallet2 size={18} />
                    )}
                  </div>

                  {isConnected ? (
                    <span className="wallet-address">
                      {formatAddress(address || "")}
                    </span>
                  ) : (
                    <span className="sidebar-menu-label">
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </span>
                  )}
                </div>
                
                <span className="walletName">Agent Wallet</span>
                <div className="sidebar-menu-item wallet-connect">
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
                  <div className="copy-button" onClick={handleCopyAddress}>
                   {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Address"}
                  </div>
                )}

                {isConnected && (
                  <div className="view-txn-button" onClick={viewTransactions}>
                    <ExternalLink size={16} /> View Transactions
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
      {showStatus && <StatusMessage />}
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
                // if(agentWalletAddress !== ""){
                  useAgentStore.getState().setActiveComponent(item.label);
                // }
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
              onClick={isConnected ? handleDisconnect : handleConnect}
            >
              <div className="sidebar-menu-icon">
                {isConnecting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Wallet2 size={18} />
                )}
              </div>
              
              {isConnected ? (
                <div className="wallet">
                  <span className="wallet-address">
                    {formatAddress(address || "")}
                  </span>
                </div>
              ) : (
                <span className="sidebar-menu-label">
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </span>
              )}
            </div>
            
            <span className="walletName">Agent Wallet</span>
            <div className="sidebar-menu-item wallet-connect">
              <div className="sidebar-menu-icon">
                <Wallet2 size={18} />
              </div>
              {agentWalletAddress ? (
                <div className="wallet">
                  <span className="wallet-address">
                    {agentWalletAddress.slice(0, 6)}...{agentWalletAddress.slice(-4)}
                  </span>
                </div>
              ) : (
                <span className="sidebar-menu-label">0x0000...0000</span>
              )}
            </div>
            
            {agentWalletAddress && (
              <div className="copy-button" onClick={handleCopyAddress}>
                {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Address"}
              </div>
            )}
            
            {isConnected && (
              <div className="view-txn-button" onClick={viewTransactions}>
                <ExternalLink size={16} /> View Transactions
              </div>
            )}
          </div>
        </div>
      </div>

      <SocialComponent />
    </Box>
  );
};