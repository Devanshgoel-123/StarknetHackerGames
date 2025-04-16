import { useCallback, useState, useEffect, act } from "react";
import "./styles.scss";
import { useRef } from "react";
import { AiOutlineEnter } from "react-icons/ai";
import { BsMic, BsMicMute } from "react-icons/bs";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { useAgentStore } from "@/store/agent-store";
import { CustomTextLoader } from "@/Components/Backend/Common/CustomTextLoader";
import Image from "next/image";
import { BACKEND_URL, DAPP_LOGO } from "@/Components/Backend/Common/Constants";
import { AgentChat } from "@/store/agent-store";
import dotenv from "dotenv";
import { FormatDisplayTextForChat } from "@/Utils/function";
dotenv.config();
export const AgentArena = () => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const { activeChat, 
    activeResponse, 
    agentResponses, 
    chatId ,
    fetching,
    agentWalletAddress
  } = useAgentStore(
    useShallow((state) => ({
      activeChat: state.activeChat,
      activeResponse: state.activeResponse,
      agentResponses: state.agentResponses,
      chatId: state.activeChatId,
      agentKey:state.agentKey,
      fetching:state.fetching,
      agentWalletAddress:state.agentWalletAddress
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
        handleEnterClick(userInput);
        userInputRef.current.value = "";
      }
    }
  };

  const handleEnterClick = async (value:string) => {
    if (value && value.trim()) {
      useAgentStore.getState().setFetching(true)
      useAgentStore.getState().setActiveChat(value);
      useAgentStore.getState().setActiveResponse("");
      try {
        const data = await axios.post(`${BACKEND_URL}/agent`, {
          messages:[{
            role:"user",
           content:`${userInputRef.current?.value}`
           }],
           address:agentWalletAddress
        });
        const response: string = data.data.message.finalResponse;
        useAgentStore.getState().setActiveResponse(response);
        useAgentStore.getState().setAgentResponses({
          query: value,
          outputString: response,
          chatId: chatId,
        });
        console.log("the agent chats are",useAgentStore.getState().agentResponses)
        useAgentStore.getState().setFetching(false);
      } catch (error) {
        useAgentStore.getState().setFetching(false);
        useAgentStore
          .getState()
          .setActiveResponse(
            "I am sorry, We couldn't process your request at the moment."
          );
        useAgentStore.getState().setAgentResponses({
          query: activeChat,
          outputString:
            "I am sorry, We couldn't process your request at the moment.",
          chatId: chatId,
        });
        console.error("Error processing agent response:", error);
      }
      
      if (userInputRef.current) {
        userInputRef.current.value = "";
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
        // Automatically send the message when speech recognition ends
        handleEnterClick(userInputRef.current.value);
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
    // The recognition will automatically stop due to continuous=false
  };

  const renderText = (response: string) => {
    if (response === "") return <CustomTextLoader text="Loading" />;
    const renderGeneralToolResponse = (answer: string) => {
      return (
        <div className="SwapBox">
          <div className="Logo">
            <Image src={DAPP_LOGO} height={30} width={30} alt="chatlogo" />
          </div>
          <div className="nestedResponse">
            <span className="responseRow">
              {answer.split("\n").filter((item)=>item!=="").map((item, index) => {
                return (
                  <div key={index} className="itemResponse">
                    {FormatDisplayTextForChat(item)}
                    <br />
                  </div>
                );
              })}
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
      renderGeneralToolResponse(response)
    );
  };

  const chatArray = agentResponses.length > 0 ? agentResponses : [];
  return (
    <div className="ArenaChatArea">
      <div className="ArenaChatBox" ref={chatBoxRef}>
        {chatArray.length > 0
          ? chatArray
              .map((item, index) => {
                const agentResponse: AgentChat = {
                  query: item.query,
                  outputString: item.outputString,
                  toolCalled: item.toolCalled,
                  chatId: item.chatId,
                };
                return (
                  <div key={index} className="PastChatBox">
                    <div className="chatTextQuestion">
                      <div className="chatText">{item.query}</div>
                    </div>
                    <div className="chatTextResponse">
                      {renderText(agentResponse.outputString)}
                    </div>
                  </div>
                );
              })
          : 
           null
          }
        {activeResponse === "" && activeChat !== "" && (
          <div className="chatTextQuestion">
            <div className="chatText">{activeChat}</div>
          </div>
        )}
        { fetching ? <div className="chatTextResponse"><CustomTextLoader text="Loading" /></div> : null}
      </div>
      <div className="AgentArenaInputContainer">
        <input
          ref={userInputRef}
          onKeyDown={handleKeyPress}
          placeholder="Ask Anything"
          className={`AgentInput ${isListening ? 'listening' : ''}`}
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
        <div className="EnterButton" onClick={()=>{handleEnterClick(userInputRef.current?.value || "")}}>
          <AiOutlineEnter />
        </div>
      </div>
    </div>
  );
};
