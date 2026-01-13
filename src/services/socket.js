import { encode, decode } from "@msgpack/msgpack";
import { baseUrl } from "./api";

let socket = null;

export function connectSocket(userId, onMessage) {
  var url = baseUrl.replace("http", "ws").replace("/api/", "/ws/chat");
  console.log("Connecting to WebSocket at:", url);
  socket = new WebSocket(`${url}?userId=${userId}`);
  socket.binaryType = "arraybuffer";

  socket.onopen = () => {
    console.log("✅ Connected");
  };

socket.onmessage = (event) => {
  const envelope = decode(new Uint8Array(event.data));

  // IMPORTANT: MessagePack keeps C# casing
  const type = envelope.Type;
  const payloadBytes = envelope.Payload;
  // payloadBytes is already Uint8Array → decode it once
  const payload = decode(payloadBytes);
  onMessage(type, payload);
};

  socket.onclose = () => {
    console.log("❌ Disconnected");
  };
}

export function send(Type, payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    encode({
      Type,
      Payload: encode(payload)
    })
  );
}
