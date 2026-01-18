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
  console.log("📩 Message received", event);
  var envelope = JSON.parse(event.data);
  // const envelope = decode(new Uint8Array(event.data));
  console.log("Decoded envelope:", envelope);
  // // IMPORTANT: MessagePack keeps C# casing
  const type = envelope.Type;
  const payloadBytes = envelope.Payload;
  // payloadBytes is already Uint8Array → decode it once
  const payload = JSON.parse(payloadBytes);
  onMessage(type, payload);
};

  socket.onclose = (event) => {
    console.log("❌ Disconnected", event);
  };
}

export function send(Type, payload) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;

  socket.send(
    JSON.stringify({
      Type,
      Payload: JSON.stringify(payload)
    })
  );
}
