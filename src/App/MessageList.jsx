import { useChat } from "../store/chatStore";

export default function MessageList({ userId }) {
  const { messages } = useChat();

  return (
    <div className="messages">
      {messages.map((msg) => {
        const isMe = String(msg.senderId ?? msg.SenderId) === String(userId);
        console.log(msg.files)
        return (
          <div
            key={msg.id ?? msg.Id}
            className={`message ${isMe ? "me" : "them"}`}
          >
            <div className="content">
              {msg.content ?? msg.Content}
              <div className="files">
              {
                msg.files && msg.files.map((file, i)=> (
                  <img key={i} src={file.file} style={{
                    height: "100px"
                  }} />
                ))
              }
              </div>
            </div>

            <div className="meta">
              {msg.read && <span>✓✓</span>}
              {!msg.read && msg.delivered && <span>✓</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
