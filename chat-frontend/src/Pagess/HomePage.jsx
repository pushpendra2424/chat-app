import {
  Box,
  Container,
  Tabs,
  Text,
  TabList,
  TabPanel,
  TabPanels,
  Tab,
  Flex,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
    // setUser(userInfo);
  }, [navigate]);

  return (
    <Container maxW={"xl"} centerContent>
      {/* <Box
        d="flex"
        justifyContent="center"
        p={"3"}
        bg={"white"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          fontSize={"4xl"}
          fontFamily={"Work sans"}
          style={{ textAlign: "center" }}
        >
          Talk-A-Tive
        </Text>
      </Box> */}
      <Flex
        direction="column"
        justify="center"
        align="center"
        h="100vh"
        w="100%"
      >
        <Box
          bg={"white"}
          w={"100%"}
          p={4}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded">
            <TabList mb={"1em"}>
              <Tab width={"50%"}>LogIn</Tab>
              <Tab width={"50%"}>SignUp</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

export default HomePage;
