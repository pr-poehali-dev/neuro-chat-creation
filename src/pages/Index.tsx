import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CharacterCard } from '@/components/CharacterCard';
import { ChatInterface } from '@/components/ChatInterface';
import { CreateCharacter } from '@/components/CreateCharacter';
import Icon from '@/components/ui/icon';

interface Character {
  id: string;
  name: string;
  description: string;
  personality: string;
  avatar: string;
}

type View = 'list' | 'chat' | 'create' | 'profile';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Алиса',
      description: 'Дружелюбный AI-ассистент, готовый помочь с любыми вопросами',
      personality: 'Дружелюбная, умная, всегда готова помочь',
      avatar: 'https://cdn.poehali.dev/projects/a27e76b2-f352-4aaa-91c6-3b0908630d8f/files/0c006031-35eb-4590-868e-3a368df4a7d8.jpg'
    },
    {
      id: '2',
      name: 'Мудрец Гэндальф',
      description: 'Древний волшебник с огромным опытом и знаниями',
      personality: 'Мудрый, спокойный, говорит загадками',
      avatar: 'https://cdn.poehali.dev/projects/a27e76b2-f352-4aaa-91c6-3b0908630d8f/files/4edc2ca9-cda0-4aff-ad2c-206ccb553744.jpg'
    },
    {
      id: '3',
      name: 'R0-B0T',
      description: 'Веселый робот-компаньон из будущего',
      personality: 'Энергичный, любопытный, обожает технологии',
      avatar: 'https://cdn.poehali.dev/projects/a27e76b2-f352-4aaa-91c6-3b0908630d8f/files/8eced023-d7d5-4ce3-aad8-c7447545974e.jpg'
    }
  ]);

  const handleChatClick = (characterId: string) => {
    setSelectedCharacterId(characterId);
    setCurrentView('chat');
  };

  const handleCreateCharacter = (newCharacter: { name: string; description: string; personality: string }) => {
    const character: Character = {
      id: Date.now().toString(),
      ...newCharacter,
      avatar: 'https://cdn.poehali.dev/projects/a27e76b2-f352-4aaa-91c6-3b0908630d8f/files/0c006031-35eb-4590-868e-3a368df4a7d8.jpg'
    };
    setCharacters(prev => [...prev, character]);
    setCurrentView('list');
  };

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  if (currentView === 'chat' && selectedCharacter) {
    return (
      <ChatInterface
        characterName={selectedCharacter.name}
        characterAvatar={selectedCharacter.avatar}
        onBack={() => setCurrentView('list')}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <CreateCharacter
        onBack={() => setCurrentView('list')}
        onCreate={handleCreateCharacter}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary mb-4">
            <Icon name="Bot" size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Character Chat
          </h1>
          <p className="text-muted-foreground">Создавайте персонажей и общайтесь с ними</p>
        </div>

        <Tabs value={currentView} onValueChange={(v) => setCurrentView(v as View)} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="list" className="gap-2">
              <Icon name="Users" size={16} />
              Персонажи
            </TabsTrigger>
            <TabsTrigger value="create" className="gap-2">
              <Icon name="Plus" size={16} />
              Создать
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={16} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  id={character.id}
                  name={character.name}
                  description={character.description}
                  avatar={character.avatar}
                  onChat={handleChatClick}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="bg-card rounded-lg p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center">
                  <Icon name="User" size={48} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Пользователь</h2>
                <p className="text-muted-foreground mb-6">user@example.com</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">{characters.length}</div>
                    <div className="text-xs text-muted-foreground">Персонажей</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-secondary">0</div>
                    <div className="text-xs text-muted-foreground">Диалогов</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">0</div>
                    <div className="text-xs text-muted-foreground">Сообщений</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Icon name="Settings" size={16} className="mr-2" />
                  Настройки
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
