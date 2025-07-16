import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Image, Send, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface PostCreationProps {
  userData: UserData;
  onClose: () => void;
  onPost: (content: string, image?: string) => void;
}

export const PostCreation = ({ userData, onClose, onPost }: PostCreationProps) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) {
      toast({
        title: "Empty post",
        description: "Please add some content or an image",
        variant: "destructive"
      });
      return;
    }

    setIsPosting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onPost(content, selectedImage || undefined);
    
    toast({
      title: "Post shared!",
      description: "Your post has been shared with the team"
    });
    
    setIsPosting(false);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-elevated">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Create Post</CardTitle>
              <CardDescription>Share your thoughts with the team</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Author Info */}
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{userData.name}</p>
              <p className="text-xs text-muted-foreground">{userData.email}</p>
            </div>
          </div>

          {/* Content Input */}
          <div className="space-y-3">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-none focus:ring-0 text-base"
              maxLength={500}
            />
            <div className="text-right text-xs text-muted-foreground">
              {content.length}/500
            </div>
          </div>

          {/* Image Preview */}
          {selectedImage && (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="w-full rounded-lg object-cover max-h-60"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground"
              >
                <Image className="w-4 h-4 mr-2" />
                Photo
              </Button>
            </div>
            
            <Button
              onClick={handlePost}
              disabled={isPosting || (!content.trim() && !selectedImage)}
              className="bg-gradient-corporate hover:bg-gradient-hero"
            >
              {isPosting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Post
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};