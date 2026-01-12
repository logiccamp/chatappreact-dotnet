import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({ userId, recipient }) {
  return (
    <div className="chat-container">
      <div className="chat-header">💬 Chat</div>
      <MessageList userId={userId} />
      <MessageInput userId={userId} recipient={recipient} />
    </div>
  );
}
