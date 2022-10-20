import React, { useEffect, useState } from "react";
/* import useEffectOnce from "../hooks/useEffectOnce";
import useIsMounted from "../hooks/useIsMounted"; */

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
    };
    setCurrentMessage("");
    socket.emit("send-message", data);
    setMessageList([...messageList, { ...data, require: true }]);
  };

  useEffect(() => {
    socket.on("rec", (data) => {
      setMessageList([...messageList, { ...data, require: false }]);
    });
  }, [messageList, socket]);

  /*  useEffect(() => {
    isMounted.current = true;
    if (isMounted.current) {
      console.log("first");
      socket.on("rec", (data) => {
        setMessageList([...messageList, data]);
      });
    }
    return () => {
      isMounted.current = false; // unmounted
    };
  }, [messageList, socket]); */

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
          {x.require ? (
            <p style={{ backgroundColor: "blue" }}>
              {x.name} : {x.message}
            </p>
          ) : (
            <p style={{ backgroundColor: "#f5f5f5" }}>
              {x.name} : {x.message}
            </p>
          )}
        </p>
      ))}
    </div>
  );
};

export default ChatComponents;
