import React, { useState } from "react";
import ChatBot from "@/components/ChatBot.jsx";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function FloatingButtons() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Chat Bot with State Tracking */}
      <ErrorBoundary>
        <div>
          <ChatBotWrapper onOpenChange={setIsChatOpen} />
        </div>
      </ErrorBoundary>
    
      {/* Notification Center, hidden when Chat Bot is open */}
      {!isChatOpen && (
        <ErrorBoundary>
          <div>
            <NotificationCenter />
          </div>
        </ErrorBoundary>
      )}
    </>
  );
} 


function ChatBotWrapper({ onOpenChange }) {
  return <ChatBotWithCallback onOpenChange={onOpenChange} />;
}

function ChatBotWithCallback({ onOpenChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (newState) => {
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  return <ChatBot isOpen={isOpen} onToggle={handleToggle} />;
}