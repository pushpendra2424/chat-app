import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import ShowToast, { configData } from "../ShowToast";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { chats, user, setChats } = ChatState();
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast(ShowToast("Please fill all the feilds", "warning"));
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((sel) => sel._id)), // Convert the array to a string before sending it to the server
        },
        configData(user.token)
      );

      setChats([data, ...chats]);
      onClose();
      toast(ShowToast("New Group Chat Created", "success"));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast(
        ShowToast(
          "Something went wrong",
          "error",
          "Failed to load the create group"
        )
      );
    }
  };

  const handleDelete = async (deletedUser) => {
    setSelectedUsers(
      selectedUsers.filter((sel) => sel._id !== deletedUser._id)
    );
  };

  const handleGroup = async (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast(ShowToast("User already added", "warning"));
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/user?search=${query}`,
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

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg : XYZ, ABC, PQR"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"}>
              {/* render selected users */}

              {selectedUsers &&
                selectedUsers.map((user) => (
                  <UserBadgeItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleDelete(user)}
                  />
                ))}

              {/* render searched users */}
              {loading ? (
                <div>loading</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
