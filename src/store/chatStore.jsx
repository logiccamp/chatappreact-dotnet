import { createContext, useContext, useState } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);

  function addMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function setInitialMessages(msgs) {
    setMessages(msgs);
  }

  function clearChat() {
    setConversation(null);
    setMessages([]);
  }

  return (
    <ChatContext.Provider
      value={{
        conversation,
        messages,
        setConversation,
        setInitialMessages,
        addMessage,
        clearChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used inside ChatProvider");
  }
  return ctx;
}
