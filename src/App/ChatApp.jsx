import { useEffect, useMemo, useState } from "react";
import { connectSocket } from "../services/socket";
import { baseUrl } from "../services/api";
import { useChat } from "../store/chatStore";
import ChatWindow from "./ChatWindow";
export default function ChatApp() {
    const [isLoading, setIsLoading] = useState(true);
  
  const {
    conversation,
    setConversation,
    setInitialMessages,
    clearChat,
    addMessage
  } = useChat();

  // Read userId ONCE
  const userId = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("userId");
  }, []);

  const recipient = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("recipient");
  }, []);

   const token = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  }, []);

  

  useEffect(() => {
    if (!userId) {
      console.error("❌ userId missing in query params");
      return;
    }

    if (!token) {
      console.error("❌ auth token is missing in prams");
      return;
    }

    connectSocket(userId, (type, payload) => {
      if (type === "message") {
        addMessage(payload);
      }
    });
  }, [userId]);

  if (!userId) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Missing <code>userId</code> in URL
      </div>
    );
  }

   if (!recipient) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Missing <code>recipient</code> in URL
      </div>
    );
  }

   if (!token) {
    return (
      <div style={{ padding: 20 }}>
        ❌ Missing <code>token</code> in URL
      </div>
    );
  }



  useEffect(() => {
    let mounted = true;

    async function loadChat() {
      try {
        // 1️⃣ fetch conversation
        const convRes = await fetch(
          `${baseUrl}chats/${recipient}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );
        const convJson = await convRes.json();
        if (!mounted) return;

        const conv = convJson.data;
        if(conv){
          setConversation(conv);
  
          // 2️⃣ fetch messages
          const msgRes = await fetch(
            `${baseUrl}chats/messages/${conv.id}`,
            {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
          );
          const msgJson = await msgRes.json();
  
          if (!mounted) return;
          setInitialMessages(msgJson.data.items ?? msgJson);
        }
        setIsLoading(false)
      } catch (err) {
        console.error("Failed to load chat:", err);
      }
    }

    loadChat();

    return () => {
      mounted = false;
      clearChat();
    };
  }, [recipient]);

  if (isLoading) return <div>Loading chat...</div>;

  return <ChatWindow userId={userId} recipient={recipient} />;
}
