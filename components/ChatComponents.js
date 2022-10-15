import React, { useEffect, useState } from "react";

const ChatComponents = ({ socket, name, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (currentMessage === "") return;
    const data = {
      room: room,
      name: name,
      message: currentMessage,
      time: Date.now(),
    };
    setCurrentMessage("");
    socket.emit("send-message", data);
    setMessageList((prev) => [...prev, data]);
  };

  useEffect(() => {
    socket.on("rec", (data) => {
      setMessageList([...messageList, data]);
    });
  }, [messageList, socket]);

  return (
    <div>
      <input
        type="text"
        placeholder="Message"
        value={currentMessage}
        onChange={(e) => setCurrentMessage(e.target.value)}
      />
      <button onClick={(e) => sendMessage(e)}>Send Message</button>

      {messageList.map((x, i) => (
        <p key={i}>
          {x.name} : {x.time} - {x.message}
        </p>
      ))}
    </div>
  );
};

export default ChatComponents;
