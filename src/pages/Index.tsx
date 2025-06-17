
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Fingerprint, LogIn } from 'lucide-react';
import Layout from '@/components/Layout';

const Index: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would validate and authenticate here
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center page-transition py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2913&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        </div>
        
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="relative mb-2 inline-block">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-eco-green-400 to-eco-blue-400 opacity-75 blur-sm animate-pulse"></div>
              <div className="relative rounded-full bg-white p-4 shadow-sm">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="url(#paint0_linear)" strokeWidth="1.5"/>
                  <path d="M8 12.4444L10.5 15L16 9" stroke="url(#paint1_linear)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3f9049"/>
                      <stop offset="1" stopColor="#0ca5eb"/>
                    </linearGradient>
                    <linearGradient id="paint1_linear" x1="8" y1="12" x2="16" y2="12" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3f9049"/>
                      <stop offset="1" stopColor="#0ca5eb"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              EcoFinance
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Transforme suas finanças. Salve o planeta.
            </p>
          </div>
          
          <div className="glass-card rounded-2xl shadow-lg px-6 py-8 mt-8">
            <form className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail ou CPF/CNPJ
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <span className="bg-white px-4 text-sm text-gray-500">ou</span>
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
                <a href="#" className="font-medium text-eco-green-600 hover:text-eco-green-500">
                  Esqueci minha senha
                </a>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-eco-green-600 hover:text-eco-green-500">
                  Criar Conta
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
