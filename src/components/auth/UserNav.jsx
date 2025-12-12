import React from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useAuthModal } from '@/contexts/AuthModalContext';
    import { Button } from '@/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from '@/components/ui/dropdown-menu';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { LogOut, User as UserIcon } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    
    export function UserNav() {
      const { user, profile, signOut } = useAuth();
      const { openAuthModal } = useAuthModal();
      const navigate = useNavigate();
      const { toast } = useToast();
    
      const handleSignOut = async () => {
        const { error } = await signOut();
        if (!error) {
          toast({
            title: "👋 See you later!",
            description: "You've been logged out successfully.",
          });
          navigate('/');
        }
      };
    
      const getInitials = (name) => {
        if (!name) return 'U';
        return name.charAt(0).toUpperCase();
      };
    
      const getAvatarUrl = (avatarId) => {
        const avatarMap = {
          alien: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/a7364cbc02a10924a2ba2e519ad328c1.png',
          goth: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/7d29636c2dee30bef33f936605597e75.png',
          princess: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/01da06f6a11f2c65fe53dee161a5c841.png',
          dino: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/bbf550d0526deab2d870a274ed64e574.png',
          baby: 'https://horizons-cdn.hostinger.com/68470a32-d856-4001-aa04-6ef3f0b873ca/b58f9a1c2f53252f97bc6677f0104419.png',
        };
        return avatarMap[avatarId] || user.user_metadata?.avatar_url;
      }
    
      if (!user) {
        return (
          <div className="flex flex-col space-y-2">
            <Button onClick={() => openAuthModal('signup')} className="w-full" variant="cta">
              Join Now
            </Button>
            <Button onClick={() => openAuthModal('login')} className="w-full" variant="ghost">
              Sign In
            </Button>
          </div>
        );
      }
    
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getAvatarUrl(profile?.avatar_url)} alt="User avatar" />
                <AvatarFallback>{getInitials(profile?.nickname || user.email)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.nickname || user.email.split('@')[0]}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link to={`/user/${profile?.nickname}`}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>My Public Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }