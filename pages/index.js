import React, { useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import Link from "next/link";
import ChatComponents from "../components/ChatComponents";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

export default function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  const joinRoomChat = (e) => {
    e.preventDefault();
    socket.emit("join-room", { id: room });
  };

  return (
    <div>
      <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="room" value={room} onChange={(e) => setRoom(e.target.value)} />

      <button onClick={(e) => joinRoomChat(e)}>Send..</button>

      <ChatComponents socket={socket} name={name} room={room} />

      <h1>Chat Room</h1>
      <Link href={`/${nanoid()}`}>
        <a>Random Room</a>
      </Link>
    </div>
  );
}
