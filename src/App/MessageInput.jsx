import { send } from "../services/socket";
import { v4 as uuid } from "uuid";
import { useMemo, useState } from "react";
import { baseUrl } from "../services/api";

export default function MessageInput({ userId, recipient }) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

const token = useMemo(() => {
        const params = new URLSearchParams(window.location.search);
        return params.get("token");
      }, []);
  async function uploadFiles() {
    const formData = new FormData();

    files.forEach(f => formData.append("files", f));

       

    const res = await fetch(baseUrl+"chats/file-upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) throw new Error("File upload failed");

    const json = await res.json();

    return json.data; // string[]
  }

  async function handleSend() {
    if (!text.trim() && files.length === 0) return;

    try {
      setUploading(true);

      let uploadedFiles = [];

      if (files.length > 0) {
        uploadedFiles = await uploadFiles();

      }

      const envelope = {
        ConversationId: null,
        RecipientId: recipient,
        Content: text,
        Files: uploadedFiles
      };

      send("message", envelope);

      setText("");
      setFiles([]);
    } catch (err) {
      console.error("Send failed:", err);
    } finally {
      setUploading(false);
    }
  }
  function handleSend1() {
    if (!text.trim()) return;
    // 550e8400-e29b-41d4-a716-446655440000
    // global-chat
    const envelope =  {
      ConversationId: null,
      RecipientId: recipient,
      Content: text,
      Files : files
    }

    
    send("message", envelope);

    setText("");
  }

  return (
    <div className="input-area">

            <input
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
      />
      
      <input
        type="file"
        multiple
        onChange={e => setFiles(Array.from(e.target.files || []))}
      />

      <button onClick={handleSend} disabled={uploading}>
        {uploading ? "Sending..." : "Send"}
      </button>

    </div>
  );
}
