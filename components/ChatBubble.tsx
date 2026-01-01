import React from 'react';

interface ChatBubbleProps {
  text: string;
  isUser?: boolean; // True if sent by user (green), False if received (white/gray)
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ text, isUser = false }) => {
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 px-2`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-md flex-shrink-0 bg-gray-300 overflow-hidden shadow-sm border border-gray-200/50`}>
             <img 
                src={isUser ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Trouble"} 
                alt="avatar" 
                className="w-full h-full object-cover bg-white"
            />
        </div>

        {/* Bubble */}
        <div className={`relative group`}>
            {/* Triangle for bubble tail */}
            <div className={`absolute top-3 w-3 h-3 transform rotate-45 
                ${isUser 
                    ? '-right-1.5 bg-[#95EC69]' 
                    : '-left-1.5 bg-white'
                }
            `}></div>

            <div
            className={`relative px-4 py-3 rounded-lg text-[15px] leading-relaxed shadow-sm text-gray-800 break-words
                ${isUser 
                ? 'bg-[#95EC69]' 
                : 'bg-white'
                }
            `}
            >
            {text}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
