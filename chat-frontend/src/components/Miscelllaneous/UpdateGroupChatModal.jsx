import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ShowToast, { configData } from "../ShowToast";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const [search, setSearch] = useState("");
  const [groupChatName, setGroupChatName] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const [loadingChat, setLoadingChat] = useState();
  const toast = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast(ShowToast("Only admins can remove members!", "error"));
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.put(
        "/api/chat/group-remove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        configData(user.token)
      );
      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast(ShowToast("Error Occured!", "error", error.response.data.message));
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        configData(user.token)
      );
      toast(ShowToast("Chat renamed!", "success"));
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast(ShowToast("Error occured!", "error", error.response.data.message));
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
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
  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((user2) => user2._id === user1._id)) {
      toast(ShowToast("User already in group!", "error"));
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast(ShowToast("Only admin can add someone!", "error"));
      return;
    }

    try {
      const { data } = await axios.put(
        `/api/chat/group-add`,
        { chatId: selectedChat._id, userId: user1._id },
        configData(user.token)
      );
      toast(ShowToast("User added in group!", "success"));
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch("");
      setShowUsers(false);
    } catch (error) {
      toast(ShowToast("Failed to add user!", "error"));
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
