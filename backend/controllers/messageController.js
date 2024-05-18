const asyncHandler = require("express-async-handler");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");
const chatModel = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }
  let newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    let message = await messageModel.create(newMessage);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await chatModel.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.status(200).send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    let messages = await messageModel
      .find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    return res.status(200).send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
