
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="w-full py-3 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm shadow-sm mb-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-eco-green-700">
            EcoCredits
          </h2>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline-block">Olá,</span>
          <span className="font-medium text-gray-900 hidden sm:inline-block">João Silva</span>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User profile" />
                <AvatarFallback className="bg-eco-green-100 text-eco-green-700">JS</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2"
                onClick={() => navigate('/profile')}
              >
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center gap-2 text-red-600"
                onClick={() => console.log('Logout clicked')}
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
