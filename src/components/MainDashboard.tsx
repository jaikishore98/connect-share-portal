import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, MoreHorizontal, Image, PenTool } from 'lucide-react';
import { PostCreation } from './PostCreation';
import { Navigation } from './Navigation';

interface Post {
  id: string;
  author: {
    name: string;
    email: string;
    avatar: string;
    department: string;
  };
  content: string;
  image?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
}

interface MainDashboardProps {
  userData: UserData;
  onLogout: () => void;
}

export const MainDashboard = ({ userData, onLogout }: MainDashboardProps) => {
  const [showPostCreation, setShowPostCreation] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b2606c3b?w=100&h=100&fit=crop&crop=face',
        department: 'Marketing'
      },
      content: 'Excited to announce our new product launch! The team has been working incredibly hard on this project. Looking forward to seeing the impact it will have on our customers. 🚀',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      timestamp: new Date('2024-01-15T10:30:00'),
      likes: 24,
      comments: 8,
      isLiked: false
    },
    {
      id: '2',
      author: {
        name: 'Mike Chen',
        email: 'mike.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        department: 'Engineering'
      },
      content: 'Great team meeting today! We discussed the upcoming features and roadmap. Always inspiring to work with such talented colleagues.',
      timestamp: new Date('2024-01-15T09:15:00'),
      likes: 12,
      comments: 3,
      isLiked: true
    },
    {
      id: '3',
      author: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        department: 'Design'
      },
      content: 'Coffee break conversations often lead to the best ideas! ☕️ Thanks everyone for the brainstorming session.',
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&h=400&fit=crop',
      timestamp: new Date('2024-01-14T15:45:00'),
      likes: 18,
      comments: 5,
      isLiked: false
    }
  ]);

  const handleNewPost = (content: string, image?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      author: {
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar,
        department: 'Your Department'
      },
      content,
      image,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    setPosts([newPost, ...posts]);
    setShowPostCreation(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation userData={userData} onLogout={onLogout} />
      
      <div className="max-w-2xl mx-auto p-4 pt-20">
        {/* Quick Actions */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                className="flex-1 justify-start text-muted-foreground"
                onClick={() => setShowPostCreation(true)}
              >
                <PenTool className="w-4 h-4 mr-2" />
                What's on your mind?
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPostCreation(true)}
              >
                <Image className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-card hover:shadow-elevated transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{post.author.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {post.author.department}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {post.author.email} • {formatTimeAgo(post.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm mb-4 leading-relaxed">{post.content}</p>
                
                {post.image && (
                  <div className="mb-4">
                    <img 
                      src={post.image} 
                      alt="Post image" 
                      className="w-full rounded-lg object-cover max-h-80"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 ${post.isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                    <Share2 className="w-4 h-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Post Creation Modal */}
      {showPostCreation && (
        <PostCreation
          userData={userData}
          onClose={() => setShowPostCreation(false)}
          onPost={handleNewPost}
        />
      )}
    </div>
  );
};