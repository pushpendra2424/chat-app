import { useNavigate } from "react-router-dom";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import ShowToast from "../components/ShowToast";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  useEffect(() => {
    const handleTimeout = () => {
      localStorage.removeItem("userInfo");
      toast(
        ShowToast("Timeout: you have not been active for 5 minutes", "warning")
      );
      navigate("/");
    };

    const timeoutId = setTimeout(handleTimeout, 1 * 60 * 1000); // 5 minutes in milliseconds

    return () => {
      clearTimeout(timeoutId);
    };
  }, [lastActivityTime, navigate, toast]);

  const handleUserActivity = () => {
    setLastActivityTime(Date.now());
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    return () => {
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
