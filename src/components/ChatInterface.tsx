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
  characterDescription: string;
  characterPersonality: string;
  onBack: () => void;
}

export const ChatInterface = ({ characterName, characterAvatar, characterDescription, characterPersonality, onBack }: ChatInterfaceProps) => {
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
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsGenerating(true);

    try {
      const chatResponse = await fetch('https://functions.poehali.dev/52c33daa-84b4-4d76-8cbe-4d94c743b416', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          characterName,
          characterPersonality,
          conversationHistory: messages
        })
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get character response');
      }

      const chatData = await chatResponse.json();
      const characterResponse = chatData.response;

      const characterMessage: Message = {
        id: Date.now().toString(),
        sender: 'character',
        text: characterResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, characterMessage]);
      setIsGenerating(false);
      setIsGeneratingImage(true);

      const imageResponse = await fetch('https://functions.poehali.dev/310c1dfc-bf3a-4f98-8bcb-b71b013f9e77', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          characterResponse,
          characterName,
          characterDescription
        })
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === characterMessage.id 
              ? { ...msg, image: imageData.imageUrl }
              : msg
          )
        );
      }
      
      setIsGeneratingImage(false);

    } catch (error) {
      console.error('Error:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        sender: 'character',
        text: 'Извините, произошла ошибка. Пожалуйста, проверьте настройки API или попробуйте позже.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setIsGenerating(false);
      setIsGeneratingImage(false);
    }
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
          {isGeneratingImage && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar className="h-8 w-8">
                <AvatarImage src={characterAvatar} alt={characterName} />
                <AvatarFallback>{characterName[0]}</AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card">
                <p className="text-sm text-muted-foreground">Создаю изображение...</p>
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
            disabled={isGenerating || isGeneratingImage}
          />
          <Button onClick={handleSend} disabled={isGenerating || isGeneratingImage || !inputValue.trim()}>
            <Icon name="Send" size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};