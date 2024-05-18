import { Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./Pagess/HomePage";
import ChatPage from "./Pagess/ChatPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/chats" element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
}

export default App;
