
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Upload, Plus, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  lastMessage: Date;
}

interface AIChatDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDialog = ({ isOpen, onClose }: AIChatDialogProps) => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Project Analysis',
      messages: [
        { id: '1', text: 'Can you analyze my project data?', sender: 'user', timestamp: new Date() },
        { id: '2', text: 'I\'d be happy to help analyze your project data. Could you share more details?', sender: 'ai', timestamp: new Date() }
      ],
      lastMessage: new Date()
    }
  ]);
  
  const [activeChatId, setActiveChatId] = useState<string>('1');
  const [message, setMessage] = useState('');
  
  const activeChat = chatSessions.find(chat => chat.id === activeChatId);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Update the active chat with new message
    setChatSessions(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, newMessage], lastMessage: new Date() }
        : chat
    ));
    
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'I understand your request. Let me help you with that.',
        sender: 'ai',
        timestamp: new Date()
      };
      
      setChatSessions(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, aiResponse], lastMessage: new Date() }
          : chat
      ));
    }, 1000);
  };
  
  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: `New Chat ${chatSessions.length + 1}`,
      messages: [],
      lastMessage: new Date()
    };
    
    setChatSessions(prev => [...prev, newChat]);
    setActiveChatId(newChat.id);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileMessage: ChatMessage = {
        id: Date.now().toString(),
        text: `Uploaded file: ${file.name}`,
        sender: 'user',
        timestamp: new Date()
      };
      
      setChatSessions(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, messages: [...chat.messages, fileMessage], lastMessage: new Date() }
          : chat
      ));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>AI Assistant</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Chat Sessions List */}
          <div className="w-1/3 border-r bg-muted/30 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Chat History</h3>
              <Button onClick={handleNewChat} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
            
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {chatSessions.map((chat) => (
                  <Card
                    key={chat.id}
                    className={`p-3 cursor-pointer transition-colors ${
                      activeChatId === chat.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveChatId(chat.id)}
                  >
                    <h4 className="font-medium text-sm truncate">{chat.title}</h4>
                    <p className="text-xs opacity-70 mt-1">
                      {chat.messages.length} messages
                    </p>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          
          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {activeChat?.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            {/* Input Area */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer">
                  <Button variant="outline" size="icon" asChild>
                    <span>
                      <Upload className="w-4 h-4" />
                    </span>
                  </Button>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </label>
                
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
