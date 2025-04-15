import { useCallback, useState, useEffect, act } from "react";
import "./styles.scss";
import { useRef } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { BsMic, BsMicMute } from "react-icons/bs";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { useAgentStore, YieldChat, YieldResponse } from "@/store/agent-store";
import { CustomTextLoader } from "@/Components/Backend/Common/CustomTextLoader";
import Image from "next/image";
import { BACKEND_URL, DAPP_LOGO } from "@/Components/Backend/Common/Constants";
import dotenv from "dotenv";
import { FormatDisplayTextForChat, prettyPrintObject } from "@/Utils/function";
import { useMediaQuery } from "@mui/material";
import { ReadyToClickActionButton } from "../../Agent/AgentChatbox/ButtonContainer";
import { BsLayoutTextSidebar } from "react-icons/bs";
import { Tooltip, IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

dotenv.config();
interface Props {
  heading: string;
  content: string;
  query: string;
}
export const AgentArena = () => {
  const MobileDevice = useMediaQuery("(max-width:600px)");
  const MediumDevice = useMediaQuery("(max-width:1028px)");
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const ButtonContent: Props[] = [
    {
      heading: "Analyse Portfolio",
      content: "Conduct An In Depth Analysis of my portfolio",
      query: "Conduct An In Depth Analysis of my portfolio",
    },
    {
      heading: "Lend Token",
      content: "Lend token on Joule Finance and Echelon Markets",
      query: "Give me the details to lend token on joule Finance",
    },
  ];
  
  const { 
    activeChat,
    activeResponse,
    agentResponses,
    agentKey,
    agentWalletAddress,
    yieldAgentFetching
   } = useAgentStore(
    useShallow((state) => ({
      activeChat: state.activeYieldChat,
      activeResponse: state.activeYieldResponse,
      agentResponses: state.yieldChats,
      agentKey:state.agentKey,
      agentWalletAddress:state.agentWalletAddress,
      yieldAgentFetching:state.yieldAgentFetching
    }))
  );

  // Check if speech recognition is supported
  useEffect(() => {
    const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(supported);
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [activeChat, activeResponse]);

  const userInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && userInputRef.current) {
      const userInput = userInputRef.current?.value;
      if (userInput.trim()) {
        handleEnterClick();
        userInputRef.current.value = "";
      }
    }
  };

  const handleEnterClick = async () => {
    if (userInputRef.current?.value) {
      useAgentStore.getState().setYieldAgentFetching(true)
      useAgentStore.getState().setActiveYieldChat(userInputRef.current.value);
      useAgentStore.getState().setActiveYieldResponse({
        analysis: "",
        recommendedAction: "",
        userQueryResponse: "",
        swap: "",
      });

      try {
        const { data } = await axios.post(`${BACKEND_URL}/userAnalysis`, {
          message: userInputRef.current?.value,
          agentKey:agentKey,
          agentWalletAddress:agentWalletAddress
        });
      
        delete data.data.recommendedAction.actionRequired;
        delete data.data.swap;
        delete data.data.userQueryResponse;
        useAgentStore.getState().setActiveYieldResponse({
          analysis: prettyPrintObject(data.data),
        });
        useAgentStore.getState().setYieldChats({
          query: activeChat,
          response: {
            analysis: prettyPrintObject(data.data),
          },
        });
        useAgentStore.getState().setYieldAgentFetching(false)
      } catch (error) {
        useAgentStore.getState().setYieldAgentFetching(false)
        useAgentStore.getState().setActiveYieldResponse({
          analysis: "Sorry We couldn't process your request at the moment",
          recommendedAction: "",
        });
        useAgentStore.getState().setYieldChats({
          query: activeChat,
          response: {
            analysis: "Sorry We couldn't process your request at the moment",
            recommendedAction: "",
          },
        });
        console.error("Error processing agent response:", error);
      }
    }
    return;
  };

  // Speech recognition functions
  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };
  
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    
    const recognition = new (SpeechRecognition as any)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    let finalTranscript = '';
    
    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          if (userInputRef.current) {
            userInputRef.current.value = finalTranscript;
          }
        } else {
          interimTranscript += transcript;
          if (userInputRef.current) {
            userInputRef.current.value = interimTranscript;
          }
        }
      }
    };
    
    recognition.onend = () => {
      setIsListening(false);
      if (finalTranscript && userInputRef.current && userInputRef.current.value.trim()) {
        // Automatically send the message when speech recognition ends with valid text
        handleEnterClick();
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };
    
    recognition.start();
    setIsListening(true);
  };
  
  const stopSpeechRecognition = () => {
    setIsListening(false);
  };

  const renderText = (response: YieldResponse) => {
    if (response.analysis === "") return <CustomTextLoader text="Loading" />;
    const renderGeneralToolResponse = (answer: string) => {
      return (
        <div className="SwapBox">
          <div className="Logo">
            <Image src={DAPP_LOGO} height={30} width={30} alt="chatlogo" />
          </div>
          <div className="nestedResponse">
            <span className="responseRow">
              <div className="itemResponse">
                {FormatDisplayTextForChat(answer)}
              </div>
            </span>
          </div>
        </div>
      );
    };
    return !response || response === undefined ? (
      <div className="nestedResponse">
        <div className="Logo">
          <Image src={DAPP_LOGO} height={30} width={30} alt="chatlogo" />
        </div>
        <span className="responseRow">
          {" "}
          {"Sorry we Couldn't process your request at the moment"}
        </span>
      </div>
    ) : (
      renderGeneralToolResponse(response.analysis)
    );
  };
  const chatArray = agentResponses.length > 0 ? agentResponses : [];
  return (
    <div className="YieldArenaChatArea">
      <div className="YieldArenaChatBox" ref={chatBoxRef}>
        {activeChat === "" && (
          <div className="ChatHeader">
            <div className="SideBarIconHeader">
              {MobileDevice && (
                <div
                  className="SideBarIcon"
                  onClick={() => {
                    useAgentStore.getState().setOpenSideBar(true);
                  }}
                >
                  <BsLayoutTextSidebar />
                </div>
              )}
            </div>
          </div>
        )}
        {!MobileDevice && activeChat === "" && (
          <div className="YieldAllButton">
            <span className="centerHeading">
              <span className="head">How can we help you today?</span>
              <Tooltip title="Need help? Get support and guidance here!" arrow>
                <IconButton className="info-icon">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </span>
            <div className="YieldButtonsWrapper">
              {ButtonContent.map((item: Props, index: number) => {
                return (
                  <ReadyToClickActionButton
                    content={item.content}
                    heading={item.heading}
                    key={index}
                    query={item.query}
                  />
                );
              })}
            </div>
          </div>
        )}

        {chatArray.length > 0
          ? chatArray
              .map((item, index) => {
                const agentResponse: YieldChat = {
                  query: item.query,
                  response: item.response,
                };
                return (
                  <div key={index} className="PastChatBoxYield">
                    <div className="YieldChatTextQuestion">
                      <div className="YieldChatText">{item.query}</div>
                    </div>
                    <div className="YieldChatTextResponse">
                      {renderText(agentResponse.response)}
                    </div>
                  </div>
                );
              })
          : 
          null
        }
        {activeResponse.analysis === "" && activeChat !== "" && (
          <div className="YieldChatTextQuestion">
            <div className="YieldChatText">{activeChat}</div>
          </div>
        )}
         { yieldAgentFetching ? <div className="YieldChatTextResponse">
          <CustomTextLoader text="Loading" />
                    </div> : null}
        </div>
      <div>
      {agentWalletAddress ? 
        <div className="YieldAgentArenaInputContainer">
          <input
            ref={userInputRef}
            onKeyDown={handleKeyPress}
            placeholder="Ask Anything"
            className={`YieldAgentInput ${isListening ? 'listening' : ''}`}
          />
          {speechSupported && (
            <div 
              className={`MicButton ${isListening ? 'active' : ''}`} 
              onClick={toggleSpeechRecognition}
              title={isListening ? "Stop listening" : "Start voice input"}
            >
              {isListening ? <BsMicMute /> : <BsMic />}
            </div>
          )}
          <div className="EnterButton" onClick={handleEnterClick}>
            <AiOutlineEnter />
          </div>
        </div>
        :
        <div className="connectWallet">
          Connect Wallet
        </div>
      }
    </div>
    </div>
  );
};
