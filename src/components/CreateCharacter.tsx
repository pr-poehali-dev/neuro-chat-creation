import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface CreateCharacterProps {
  onBack: () => void;
  onCreate: (character: { name: string; description: string; personality: string }) => void;
}

export const CreateCharacter = ({ onBack, onCreate }: CreateCharacterProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [personality, setPersonality] = useState('');

  const handleSubmit = () => {
    if (name && description && personality) {
      onCreate({ name, description, personality });
      setName('');
      setDescription('');
      setPersonality('');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-background to-muted/20">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <Icon name="ArrowLeft" size={18} className="mr-2" />
          Назад
        </Button>

        <Card className="p-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Создать персонажа</h1>
              <p className="text-sm text-muted-foreground">Опишите характер и личность вашего AI-персонажа</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Имя персонажа</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Алиса"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Краткое описание</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Кто этот персонаж? Чем занимается?"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personality">Характер и личность</Label>
              <Textarea
                id="personality"
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                placeholder="Какой у персонажа характер? Как он общается? Какие у него черты?"
                rows={5}
              />
              <p className="text-xs text-muted-foreground">
                Например: "Дружелюбный и веселый. Любит шутить и рассказывать истории. Всегда готов помочь и поддержать."
              </p>
            </div>

            <Button 
              onClick={handleSubmit} 
              disabled={!name || !description || !personality}
              className="w-full"
              size="lg"
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Создать персонажа
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
