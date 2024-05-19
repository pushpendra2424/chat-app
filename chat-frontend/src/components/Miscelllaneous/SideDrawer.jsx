import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useNavigate } from "react-router-dom";
import ShowToast, { configData } from "../ShowToast";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../../Config/ChatLogics";
const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();
  const toast = useToast();

  const logOutHandler = () => {
    toast(ShowToast("User logout successfully", "success"));

    setTimeout(() => {
      localStorage.removeItem("userInfo");
      navigate("/");
    }, 200);
    return;
  };

  const handleSearch = async () => {
    if (!search) {
      setLoading(false);
      toast(ShowToast("Pleage enter something in search", "warning"));
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user?search=${search}`,
        configData(user.token)
      );

      setSearchResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast(
        ShowToast(
          "Something went wrong",
          "error",
          "Failed to load the search users"
        )
      );
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        configData(user.token)
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);

      onClose();
    } catch (error) {
      toast(ShowToast("Error creating user", "error", error.message));
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w={"100%"}
        borderWidth={"5px"}
        p={"5px 10px 5px 10px"}
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        {/* <Text fontSize={"2xl"} fontFamily={"Work sans"}>
          Talk-A-Tive
        </Text> */}
        <div>
          <Menu>
            <MenuButton p={1} position="relative">
              {notification.length > 0 && (
                <Badge
                  background={"red"}
                  color="white"
                  borderRadius="50%"
                  fontSize="10px"
                  p="4px 8px"
                  position="absolute"
                  top="-2px"
                  right="2px"
                  zIndex="1"
                >
                  {notification.length}
                </Badge>
              )}
              <BellIcon fontSize={"2xl"} m={1} />
              {/* <Notification count={notification.length} /> */}
            </MenuButton>
            <MenuList m={2} p={3}>
              {!notification.length && "No New Notification"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message in ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              ></Avatar>
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuList cursor={"pointer"} p={3}>
                  My Profile
                </MenuList>
              </ProfileModel>
              <MenuDivider />
              <MenuList p={3} onClick={logOutHandler} cursor={"pointer"}>
                Logout
              </MenuList>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>Search Users</DrawerHeader>
          <DrawerBody>
            <Box display={"flex"} pb={2}>
              <Input
                placeholder="Search by name or emailId"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search.length >2 && (
                <Button onClick={handleSearch} isLoading={loading}>
                  Go
                </Button>
              )}
              
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((e) => (
                <UserListItem
                  user={e}
                  key={e._id}
                  handleFunction={() => accessChat(e._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} display={"flex"} />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
