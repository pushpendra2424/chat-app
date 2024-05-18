// import { useNavigate } from "react-router-dom";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useToast } from "@chakra-ui/react";
// import ShowToast from "../components/ShowToast";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [user, setUser] = useState(null);
//   const [selectedChat, setSelectedChat] = useState(null);
//   const [chats, setChats] = useState([]);
//   const [notification, setNotification] = useState([]);
//   const [lastActivityTime, setLastActivityTime] = useState(Date.now());

//   useEffect(() => {
//     const userInfo = JSON.parse(localStorage.getItem("userInfo"));
//     if (!userInfo) {
//       navigate("/");
//     } else {
//       setUser(userInfo);
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const handleTimeout = () => {
//       localStorage.removeItem("userInfo");
//       toast(
//         ShowToast("Timeout: you have not been active for 5 minutes", "warning")
//       );
//       navigate("/");
//     };

//     const activityTimeout = setTimeout(handleTimeout, 5 * 60 * 1000); // 2 minutes in milliseconds

//     return () => clearTimeout(activityTimeout);
//   }, [lastActivityTime, navigate, toast]);

//   const handleUserActivity = () => {
//     setLastActivityTime(Date.now());
//   };

//   useEffect(() => {
//     window.addEventListener("mousemove", handleUserActivity);
//     window.addEventListener("keydown", handleUserActivity);

//     return () => {
//       window.removeEventListener("mousemove", handleUserActivity);
//       window.removeEventListener("keydown", handleUserActivity);
//     };
//   }, []);

//   return (
//     <ChatContext.Provider
//       value={{
//         user,
//         setUser,
//         selectedChat,
//         setSelectedChat,
//         chats,
//         setChats,
//         notification,
//         setNotification,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const ChatState = () => {
//   return useContext(ChatContext);
// };

// export default ChatProvider;

import { useNavigate } from "react-router-dom";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
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
  const timeoutRef = useRef(null); // Use ref to store the timeout

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    } else {
      setUser(userInfo);
    }
  }, [navigate]);

  const handleTimeout = () => {
    localStorage.removeItem("userInfo");
    toast(
      ShowToast("Timeout you have not been active for 5 minutes", "warning")
    );
    navigate("/");
  };

  const resetTimeout = () => {
    // Clear the existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set a new timeout
    timeoutRef.current = setTimeout(handleTimeout, 5 * 60 * 1000); // 5 minutes
  };

  const handleUserActivity = () => {
    setLastActivityTime(Date.now());
    resetTimeout();
  };

  useEffect(() => {
    // Attach the handleUserActivity function to various user interactions
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);

    // Reset the timeout when the component mounts
    resetTimeout();

    return () => {
      // Remove event listeners and clear timeout when the component unmounts
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
