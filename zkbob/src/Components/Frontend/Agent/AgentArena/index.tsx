import { useCallback, useState, useEffect, act } from "react";
import "./styles.scss";
import { useRef } from "react";
import { AiOutlineEnter } from "react-icons/ai";
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

  const { activeChat, 
    activeResponse, 
    agentResponses, 
    chatId ,
    agentKey,
    fetching
  } = useAgentStore(
    useShallow((state) => ({
      activeChat: state.activeChat,
      activeResponse: state.activeResponse,
      agentResponses: state.agentResponses,
      chatId: state.activeChatId,
      agentKey:state.agentKey,
      fetching:state.fetching
    }))
  );

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
    if (userInputRef.current?.value) {
      useAgentStore.getState().setFetching(true)
      useAgentStore.getState().setActiveChat(userInputRef.current.value);
      useAgentStore.getState().setActiveResponse("");
      try {
        const { data } = await axios.post(`${BACKEND_URL}/agent`, {
          message: userInputRef.current?.value,
          chatId: chatId,
          agentKey:agentKey
        });
        const response: string = data.data.agentResponse;
       
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
    }
    return;
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
          className="AgentInput"
        />
        <div className="EnterButton" onClick={()=>{handleEnterClick(userInputRef.current?.value || "")}}>
          <AiOutlineEnter />
        </div>
      </div>
    </div>
  );
};
