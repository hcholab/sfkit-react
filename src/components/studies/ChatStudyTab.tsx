import React, { useEffect, useState } from "react";
import { Study } from "../../types/study";
import { doc, onSnapshot } from "firebase/firestore";
import { getDb } from "../../hooks/firebase";
import { Message } from "../../types/study";

interface Props {
  study: Study;
  userId: string;
  idToken: string;
}

const ChatStudyTab: React.FC<Props> = ({ study, userId, idToken }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [displayNames, setDisplayNames] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const db = getDb();
    const unsubscribe = onSnapshot(doc(db, "studies", study.study_id), (doc) => {
      const chatArray = doc.data()?.messages || [];
      setMessages(chatArray);
    });

    const displayNameUnsub = onSnapshot(doc(db, "users", "display_names"), (doc) => {
      if (doc.exists()) {
        setDisplayNames(doc.data() || {});
      }
    });

    return () => {
      unsubscribe();
      displayNameUnsub();
    };
  }, [study.study_id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const message = formData.get("message");

    if (message) {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/api/send_message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ message, sender: userId, study_id: study.study_id }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.warn("Message is empty");
    }
  };

  return (
    <div className="container p-2">
      <div id="past_messages" className="my-2 d-flex flex-column overflow-auto" style={{ maxHeight: "60vh" }}>
        {messages.length === 0 ? (
          <div className="alert alert-secondary text-start">
            <small className="text-muted text-start">
              Send a message here to share information with other study participants.
            </small>
          </div>
        ) : null}

        {messages.map((message, index) => (
          <div key={index} className={`message d-flex ${message.sender === userId ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`alert ${message.sender === userId ? "alert-primary" : "alert-dark"}`}>
              <div className="message-header text-start mb-2">
                <b>
                  <span className="message-sender">{displayNames[message.sender] || message.sender} </span>
                </b>
                <span className="message-time text-muted">{message.time}</span>
              </div>
              <div className="message-body text-start" style={{ wordBreak: "break-word" }}>
                {message.body}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="send_message" className="flex-grow-0 pt-3 px-4 border-top">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Type your message" id="message" name="message" />
            <button className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatStudyTab;
