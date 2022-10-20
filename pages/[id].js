import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";
import ChatComponents from "../components/ChatComponents";
import useEffectOnce from "../hooks/useEffectOnce";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

const ChatID = () => {
  const router = useRouter();
  const { id } = router.query;
  const [name, setName] = useState("");

  useEffect(() => {
    socket.emit("join-room", { id });
    setName(nanoid());
  }, [id]);

  return (
    <div>
      <h1>Chat : {id}</h1>

      <ChatComponents socket={socket} name={name} room={id} />
    </div>
  );
};

export default ChatID;
