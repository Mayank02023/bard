const express = require('express');
const app = express();
const fs = require('fs');

const filePath = './chat.json';


// Sample data (replace this with your actual data source)
const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const MODEL_NAME = "models/chat-bison-001";
const API_KEY = "AIzaSyBk8QqL92Dvj6sMPVUbMzamKSpq39CREvU"
const client = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

const context = "My name is Mayank Gangwar.";

let messages = JSON.parse(fs.readFileSync(filePath));


// Route to handle GET request for fetching all data
// app.get("/",(req,res)=>{
//   res.send({"message":"Welcome to BARD."})
// })
app.get('/', (req, res) => {
  messages.push({ content: req.query == null ? "Hello" : req.query.ques });
  client.generateMessage({
    // required, which model to use to generate the result
    model: MODEL_NAME,
    // optional, 0.0 always uses the highest-probability result
    temperature: 0.25,
    // optional, how many candidate results to generate
    candidateCount: 1,
    // optional, number of most probable tokens to consider for generation
    top_k: 40,
    // optional, for nucleus sampling decoding strategy
    top_p: 0.95,
    prompt: {
      context:context,
      messages: messages,
    },
  }).then(result => {
    console.log("Prince:", req.query == null ? "Hello" : req.query.ques );
    console.log("Bot:", result[0].candidates[0]?.content);
    messages.push({ content: result[0].candidates[0]?.content });
    fs.writeFileSync(filePath, JSON.stringify(messages), 'utf8');
    res.status(200).json({ resp: result[0].candidates[0]?.content });
  });
});

// Start the server
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
