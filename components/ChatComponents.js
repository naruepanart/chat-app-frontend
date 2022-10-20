import React, { useEffect, useRef, useState } from "react";
/* import useEffectOnce from "../hooks/useEffectOnce";
import useIsMounted from "../hooks/useIsMounted"; */
import styles from "./styles.module.css";

const ChatComponents = ({ socket, name, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesColumnRef = useRef(null);

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
    return () => {
      socket.off("rec");
    };
  }, [messageList, socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
  }, [messageList]);

  return (
    <div>
      <div className={styles.messagesColumn} ref={messagesColumnRef}>
        {messageList.map((x, i) => (
          <p key={i}>
            {x.require ? (
              <p
                style={{
                  background: "linear-gradient(115deg, #62cff4, #2c67f2)",
                  textAlign: "right",
                  color: "#FFF",
                  padding: "3em",
                }}
              >
                {x.name} : {x.message}
              </p>
            ) : (
              <p style={{ backgroundColor: "#F1F5F9", padding: "3em" }}>
                {x.name} : {x.message}
              </p>
            )}
          </p>
        ))}
      </div>
      <div>
        <input
          className={styles.messageInput}
          type="text"
          placeholder="Type a message..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChatComponents;
