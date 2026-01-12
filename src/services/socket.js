import { encode, decode } from "@msgpack/msgpack";

let socket = null;

export function connectSocket(userId, onMessage) {
  socket = new WebSocket(`ws://localhost:5169/ws/chat?userId=${userId}`);
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
