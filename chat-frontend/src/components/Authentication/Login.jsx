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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShowToast, { configData } from "../ShowToast";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const { user, setUser } = ChatState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    try {
      const payload = { email, password };

      const res = await axios.post(`/api/user/login`, payload, configData());
      if (res && res.status === 200) {
        setUser(res.data);

        localStorage.setItem("userInfo", JSON.stringify(res.data));
        toast(ShowToast("User login successfully", "success"));
        setTimeout(() => {
          navigate("/chats");
        }, 100);
      }
    } catch (error) {
      toast(ShowToast(`${error.response.data.message}`, "error"));
    } finally {
      [setEmail, setPassword].forEach((clearInput) => clearInput(""));

      setLoading(false);
    }
  };

  return (
    <VStack spacing={"5px"}>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter your email"
          value={email}
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
            <Button
              h={"1.75rem"}
              size={"sm"}
              onClick={handleClick}
              isDisabled={password.length < 5}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="green"
        width={"100%"}
        style={{ margin: 15 }}
        onClick={email && password ? submitHandler : null}
        isLoading={loading}
        isDisabled={!email || !password}
      >
        Login
      </Button>
      <Button
        variant={"solid"}
        color={"white"}
        colorScheme="blue"
        width={"100%"}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("12345");
        }}
      >
        Login by guest user credential
      </Button>
    </VStack>
  );
};

export default Login;
