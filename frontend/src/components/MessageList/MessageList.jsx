import styles from "./MessageList.module.css";
import ChatMessage from "../ChatMessage/ChatMessage.jsx";


// destructure conversations from props
function MessageList({isLoading, conversations}) {
    return (
     
        <div className={styles.messages}>
          {/* loop through conversations and display the messages */}

            {/* conditional Rendering */}
            {conversations.length === 0 ? (
              <div className={styles.empty}>What are you working on?</div>
            ) : (
              conversations.map((msg) => (
                //   Child Component to display each message
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                />
              ))
            )}
        {isLoading && <div>Loading...</div>}
        
        </div>
   
    );
}

export default MessageList;
