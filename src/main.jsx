import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ReactDOM from "react-dom/client";
import { ChatProvider } from "./store/chatStore";
// import "./styles/chat.css";
import ChatApp from './App/ChatApp';

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
  <ChatProvider>
    <ChatApp />
  </ChatProvider>
  </StrictMode>,
)
