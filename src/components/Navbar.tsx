import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usuario, UsuarioResposta, buscarImagemUsuario } from "@/services/Usuario";
import React, { useEffect, useState } from "react";
import logo from "@/assets/logo-soscarbono.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioResposta | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  // Buscar usuário logado e imagem de perfil
  useEffect(() => {
    async function carregarDados() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const dados = await usuario(token);
        setUsuarioLogado(dados);

        const foto = await buscarImagemUsuario(token);
        setFotoPerfil(foto);
      } catch (error) {
        console.error("Erro ao carregar dados do usuário:", error);
      }
    }

    carregarDados();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full py-3 px-4 sm:px-6 lg:px-8 bg-white/80 backdrop-blur-sm shadow-sm mb-6">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* <h2 className="text-xl font-semibold text-eco-green-700">
            EcoCredits
          </h2> */}
          <img
            src={logo}
            alt="Logo SOS Carbono"
            className="w-40 h-auto sm:w-48" // 👈 ajusta o tamanho conforme a tela
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:inline-block">Olá,</span>
          <span className="font-medium text-gray-900 hidden sm:inline-block">
            {usuarioLogado ? usuarioLogado.nome.split(" ")[0] : "Carregando..."}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                <AvatarImage
                  src={fotoPerfil || undefined}
                  alt="User profile"
                />
                <AvatarFallback className="bg-eco-green-100 text-eco-green-700">
                  {usuarioLogado?.nome
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2) || "US"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer flex items-center gap-2 text-red-600"
                onClick={logout}
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
