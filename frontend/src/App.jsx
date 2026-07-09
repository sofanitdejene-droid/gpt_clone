import Sidebar from "./components/Sidebar/Sidebar"
import ChatHeader from "./components/ChatHeader/ChatHeader";
import MessageList from "./components/MessageList/MessageList";
import {useState, useEffect} from "react";
import axios from "axios";
import ChatInput from "./components/ChatInput/ChatInput";



function App() {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
 async function fetchConversations() {
   try {
     setIsLoading(true)
    const {data}= await axios.get("https://gpt-clone-szx5.onrender.com/api/chat/conversations");

  setConversations(data.data);
  }catch (error) {
    console.error( error.message);
   } finally {
     setIsLoading(false)
   }
  }
  
  // post question to backend
  async function handleSubmit(question) {
    if (!question.trim()) {
      return;
    }

    const tempQuestions = {
      id: Date.now(),
      content: question.trim(),
      role: 'user'
    };

    setConversations([...conversations, tempQuestion]);



    try {
      const { data } = await axios.post(
        "https://gpt-clone-szx5.onrender.com/api/chat/conversations",
        { question: question.trim() }
      );
console.log(data.data)

    } catch (error) {
      console.log(error.message)
    }
    


  }





  // initial render fetch
  useEffect(() => {
    fetchConversations();
  },[]);
  
  return (
    <div className="app">
      <Sidebar />

      <main className="chat">
        <ChatHeader />
        {/* pass conversations state value as a props */}

        <MessageList isLoading={isLoading} conversations={conversations} />

        <ChatInput isLoading={isLoading} handleSubmit={handleSubmit} />
      </main>
    </div>
  );
}

export default App