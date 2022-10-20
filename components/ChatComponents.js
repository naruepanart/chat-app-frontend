import React, { useEffect, useRef, useState } from "react";
/* import useEffectOnce from "../hooks/useEffectOnce";
import useIsMounted from "../hooks/useIsMounted"; */
import styles from "./styles.module.css";

const ChatComponents = ({ socket, name, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesColumnRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket.emit("setup", () => room);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop-typing", () => setIsTyping(false));

    socket.on("rec", (data) => {
      setMessageList([...messageList, { ...data, require: false }]);
    });
    return () => {
      socket.off("rec");
    };
  }, [messageList, room, socket]);

  useEffect(() => {
    messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
  }, [messageList]);

  const sendMessage = (e) => {
    e.preventDefault();
    socket.emit("stop-typing", room);
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

  const handleTyping = (e) => {
    setCurrentMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", room);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop-typing", room);
        setTyping(false);
      }
    }, timerLength);
  };

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
          placeholder={isTyping ? "Someone Typing message..." : undefined}
          value={currentMessage}
          onChange={handleTyping}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage(e);
            }
          }}
          //onKeyDown={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatComponents;
