import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import { useRouter } from "next/router";

const socket = io("http://localhost:3001", { transports: ["websocket"] });

const ChatID = () => {
  const router = useRouter();
  const { id } = router.query;
  const [message, setMessage] = useState([]);

  const handlepost = (e) => {
    e.preventDefault();
    socket.emit("join-room", { message: nanoid() });
  };

  useEffect(() => {
    let isMounted = false;
    socket.emit("join-room", { id });
    socket.on({id}, (data) => {
      setMessage([...message, data]);
    });
    return () => {
      isMounted = true;
    };
  }, [id, message]);

  return (
    <div>
      <h1>ChatID</h1>
      <p>{id}</p>

      {/* <input type="text" value={nanoid()} onChange={(e) => setMessage(e.target.value)} /> */}
      <button onClick={(e) => handlepost(e)}>Send massage</button>

      <p>Recive message {id}</p>
      {message.map((x, i) => (
        <li key={i}>{x.message}</li>
      ))}
    </div>
  );
};

export default ChatID;
