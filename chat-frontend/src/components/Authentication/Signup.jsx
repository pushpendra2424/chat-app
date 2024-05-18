import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowToast, { configData } from "../ShowToast";
import { ChatState } from "../../Context/ChatProvider";

const Signup = () => {
  const { setUser } = ChatState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pic, setPic] = useState(null);
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const postDetails = async (file) => {
    setLoading(true);
    if (!file) {
      toast(ShowToast("Please select an image", "warning"));
      return;
    }

    if (file.type === "image/jpeg" || file.type === "image/png") {
      const formData = new FormData();
      formData.append("pic", file);
      try {
        const response = await axios.post(`/api/user/uploads`, formData);

        setPic(response.data.fileName);

        toast(ShowToast("Image uploaded successfully", "success"));
      } catch (error) {
        toast(
          ShowToast(
            "Error when uploading image",
            "error",
            error?.response?.data?.message || "Something went wrong"
          )
        );

        setPic(null);
      } finally {
        setLoading(false);
      }
    } else {
      toast(ShowToast("Invalid image format", "error"));
      setPic(null);
      setLoading(false);
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (password !== confirmPassword) {
      toast(ShowToast("Password does not match", "error"));
      setLoading(false);
      return;
    }
    try {
      const payload = { name, email, password, pic: pic || undefined };

      const res = await axios.post(`/api/user`, payload, configData());

      if (res && res.status === 201) {
        setUser(res.data);
        localStorage.setItem("userInfo", JSON.stringify(res.data));
        toast(ShowToast("User registered successfully", "success"));
        [setName, setEmail, setPassword, setPic].forEach((clearInput) =>
          clearInput("")
        );
        setTimeout(() => {
          navigate("/chats");
        }, 100);
      }
    } catch (error) {
      toast(
        ShowToast(
          "User not created",
          "error",
          error.response.data.message || "Something went wrong"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          value={name}
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        ></Input>
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            value={confirmPassword}
            type={show ? "text" : "password"}
            placeholder="Enter your confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width={"4.5rem"}>
            <Button h={"1.75rem"} size={"sm"} onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic" isRequired>
        <FormLabel>Upload your Picture</FormLabel>
        <InputGroup>
          <Input
            id="pic"
            type="file"
            bg="white"
            p={1.5}
            accept="image/*"
            placeholder="Upload your picture."
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="green"
        width={"100%"}
        style={{ margin: 15 }}
        onClick={submitHandler}
        isLoading={loading}
        isDisabled={!name || !email || !password || !confirmPassword}
      >
        Signup
      </Button>
    </VStack>
  );
};

export default Signup;
