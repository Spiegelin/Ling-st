// ChatAppScreen.jsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";
import { Sidebar } from "../components/Sidebar";
import Messages from "../pages/Chat/Messages";
import ChatHeader from "../pages/Chat/ChatHeader";
import MessageInput from "../components/MessageInput";
import ChatList from "../pages/Chat/ChatList";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const token = cookies.get('token');

const socket = io("http://localhost:3002", {
  auth: {
    token: token
  }
});

export function ChatAppScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const userProfileImage = "https://scontent-qro1-1.xx.fbcdn.net/v/t39.30808-6/321236782_1336144920477645_1360752776053520884_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=pslfT2deIN4Q7kNvgFxANPC&_nc_ht=scontent-qro1-1.xx&oh=00_AYBtVzrdfA-4YtuTq_KTC6S4NAw3pxA6ddLRJav4lBkB9A&oe=66532B5E"; 
  const [room, setRoom] = useState("");
  const [partnerId, setPartnerId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      const newMessage = {
        text: message,
        isSent: true,
        time: new Date().toLocaleTimeString(),
        user: {
          profileImage: userProfileImage
        }
      };
      console.log("Mensaje enviado: ", newMessage); //quitar lo de profile image
      socket.emit("message", { room, message: newMessage, partnerId});
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedChat.name]: [...(prevMessages[selectedChat.name] || []), newMessage]
      }));
      setMessage("");
    }
  };

  const receiveMessage = (message) => {
    console.log("Mensaje recibido: ", message);
    /*
    const isDuplicate = messages[selectedChat.name]?.some((msg) => msg.text === message.text);
    const isSelfMessage = message.isSent;
    if (!isDuplicate && !isSelfMessage) {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedChat.name]: [...(prevMessages[selectedChat.name] || []), { ...message, isSent: false }]
      }));
    }
    */

    setMessages((prevMessages) => ({
      ...prevMessages,
      [selectedChat.name]: [...(prevMessages[selectedChat.name] || []), { ...message, isSent: false }]
    }));

  };

  const handleTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 3000);
  };

  // useEffect para manejar la conexión al room
  useEffect(() => {
    if (!selectedChat) return;
    // Emitir evento para unirse a la conversación con partnerId 4
    if (selectedChat.name == "Mitski"){
      setPartnerId(4)
    }else if (selectedChat.name == "Paul Van Lopez"){
      setPartnerId(5)
    }
  
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat) return; //chance aqui el condicional es con partnerId
    console.log("Useffect de conexion a room")
    if (socket) {
      socket.emit("joinConversation", { partnerId: partnerId }, (response) => {
        if (response.room) {
          setRoom(response.room); // Guardar el nombre del room
        }
      });
    }
  }, [partnerId]);


  useEffect(() => {
    if (!selectedChat) return;
    console.log("Useffect")
    if (socket) {
      socket.on("message", receiveMessage);
      socket.on("typing", handleTyping);
    }

    return () => {
      if (socket) {
        socket.off("message", receiveMessage);
        socket.off("typing", handleTyping);
      }
    };
  }, [selectedChat]);

  return (
    <PageContainer>
      <Sidebar />
      <MainContainer>
        <ChatHeader selectedChat={selectedChat} />
        <ChatContainer>
          <Messages messages={messages[selectedChat?.name] || []} isTyping={isTyping} />
        </ChatContainer>
        <MessageInputContainer>
          <MessageInput
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
          />
        </MessageInputContainer>
      </MainContainer>
      <ChatListContainer>
        <ChatList onSelectChat={setSelectedChat} />
      </ChatListContainer>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: #f9f9f9;
  position: relative;
`;

const ChatContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 80px;
`;

const ChatListContainer = styled.div`
  width: 320px;
  border-left: 1px solid #ddd;
  background: #f0f0f0;
  overflow-y: auto;
`;

const MessageInputContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 10px;
`;
