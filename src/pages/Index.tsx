import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Fingerprint, LogIn } from "lucide-react";
import Layout from "@/components/Layout";
import logo from "@/assets/logo-soscarbono.png";
import { login } from "@/services/login";
import { AxiosError } from "axios";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposta = await login({ email, senha });
      localStorage.setItem("token", resposta.token);
      navigate("/dashboard");
    } catch (erro: unknown) {
      const err = erro as AxiosError<{ mensagem: string }>;
      if (err.response?.data?.mensagem) {
        toast.error(err.response.data.mensagem);
      } else {
        toast.error("Erro inesperado ao fazer login.");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center page-transition py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
         
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <img src={logo} alt="Logo SOS Carbono" className="mx-auto mt-7 w-60 h-auto" />
            <p className="mt-2 text-sm text-gray-600">
              Conectando você a um futuro mais verde. Salve o planeta.
            </p>
          </div>

          <div className="glass-card rounded-2xl shadow-lg px-6 py-8 mt-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  E-mail ou CNPJ
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="eco-input"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="eco-input pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="eco-button w-full flex justify-center items-center py-3"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  Entrar
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">
                    ou
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex w-full justify-center items-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all"
                >
                  <Fingerprint className="h-5 w-5 mr-2 text-eco-green-500" />
                  Entrar com Biometria
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="forgot-password"
                  className="font-medium text-eco-green-600 hover:text-eco-green-500"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="text-sm">
                <Link
                  to="/registration"
                  className="font-medium text-eco-green-600 hover:text-eco-green-500"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
