import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CharacterCardProps {
  id: string;
  name: string;
  description: string;
  avatar: string;
  onChat: (id: string) => void;
}

export const CharacterCard = ({ id, name, description, avatar, onChat }: CharacterCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
        <img 
          src={avatar} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="font-semibold text-lg mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
        <Button 
          onClick={() => onChat(id)}
          className="w-full"
          size="sm"
        >
          <Icon name="MessageCircle" size={16} className="mr-2" />
          Начать чат
        </Button>
      </div>
    </Card>
  );
};
