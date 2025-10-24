import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Message {
  id: string;
  sender: 'user' | 'character';
  text: string;
  image?: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  characterName: string;
  characterAvatar: string;
  onBack: () => void;
}

export const ChatInterface = ({ characterName, characterAvatar, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'character',
      text: `Привет! Я ${characterName}. Чем могу помочь?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsGenerating(true);

    setTimeout(() => {
      const characterMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'character',
        text: 'Интересно! Позвольте мне продумать это...',
        image: 'https://cdn.poehali.dev/projects/a27e76b2-f352-4aaa-91c6-3b0908630d8f/files/0c006031-35eb-4590-868e-3a368df4a7d8.jpg',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, characterMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b bg-card px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <Icon name="ArrowLeft" size={20} />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={characterAvatar} alt={characterName} />
          <AvatarFallback>{characterName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{characterName}</h2>
          <p className="text-xs text-muted-foreground">Онлайн</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 animate-fade-in ${
                message.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {message.sender === 'character' && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={characterAvatar} alt={characterName} />
                  <AvatarFallback>{characterName[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className={`flex flex-col gap-2 max-w-[70%] ${
                message.sender === 'user' ? 'items-end' : ''
              }`}>
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-card'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </Card>
                {message.image && (
                  <div className="rounded-lg overflow-hidden animate-scale-in">
                    <img 
                      src={message.image} 
                      alt="Generated scene"
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar className="h-8 w-8">
                <AvatarImage src={characterAvatar} alt={characterName} />
                <AvatarFallback>{characterName[0]}</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t bg-card p-6">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Напишите сообщение..."
            disabled={isGenerating}
          />
          <Button onClick={handleSend} disabled={isGenerating || !inputValue.trim()}>
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};
