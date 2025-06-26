import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { IMaskInput } from 'react-imask';
import Layout from '@/components/Layout';
import { cadastrarUsuario, UsuarioCadastro } from '@/services/Usuario';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

const limparMascara = (valor: string) => valor.replace(/\D/g, '');

const Cadastro: React.FC = () => {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [telefone, setTelefone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);

  const validarEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(senha);

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroMensagem(null);

    if (!validarEmail(email)) {
      setErroMensagem('Por favor, insira um e-mail válido.');
      return;
    }

    if (!validarSenha(senha)) {
      setErroMensagem('A senha deve conter ao menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial.');
      return;
    }

    if (senha !== confirmaSenha) {
      setErroMensagem('As senhas não coincidem.');
      return;
    }

    if (limparMascara(cnpj).length !== 14) {
      setErroMensagem('Preencha o CNPJ completo.');
      return;
    }

    if (limparMascara(telefone).length !== 11) {
      setErroMensagem('Preencha o telefone completo.');
      return;
    }

    const dados: UsuarioCadastro = {
      nome,
      email,
      senha,
      empresa,
      cnpj: limparMascara(cnpj),
      telefone: limparMascara(telefone),
    };

    try {
      await cadastrarUsuario(dados);
      toast.success('Conta criada com sucesso! ✅');
      setTimeout(() => navigate('/'), 10000);
    } catch (error) {
      const err = error as AxiosError<{ mensagem?: string }>;
      const msg = err.response?.data?.mensagem?.toLowerCase() || '';

      if (err.response?.status === 400) {
        if (msg.includes('email')) {
          setErroMensagem('Este e-mail já está cadastrado.');
        } else if (msg.includes('cnpj')) {
          setErroMensagem('Este CNPJ já está cadastrado.');
        } else if (msg.includes('telefone')) {
          setErroMensagem('Este telefone já está cadastrado.');
        } else if (msg.includes('obrigatório')) {
          setErroMensagem('Todos os campos são obrigatórios.');
        } else {
          setErroMensagem('Erro ao cadastrar usuário. Verifique os dados.');
        }
      } else {
        setErroMensagem('Erro ao cadastrar usuário. Tente novamente.');
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center page-transition py-12 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="self-start mb-6 flex items-center text-eco-green-600 hover:text-eco-green-700"
          aria-label="Voltar"
        >
          <ArrowLeft className="mr-2" />
          Voltar
        </button>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Criar Conta
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Preencha os dados para criar sua conta
            </p>
          </div>

          <div className="glass-card rounded-2xl shadow-lg px-6 py-8 mt-4">
            <form className="space-y-6" onSubmit={handleCadastro}>
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                  Nome completo
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="eco-input"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="eco-input"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="senha"
                    name="senha"
                    type={showPassword ? 'text' : 'password'}
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
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmaSenha" className="block text-sm font-medium text-gray-700">
                  Confirmar Senha
                </label>
                <input
                  id="confirmaSenha"
                  name="confirmaSenha"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmaSenha}
                  onChange={(e) => setConfirmaSenha(e.target.value)}
                  className="eco-input"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">
                  Empresa
                </label>
                <input
                  id="empresa"
                  name="empresa"
                  type="text"
                  required
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="eco-input"
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                  CNPJ
                </label>
                <IMaskInput
                  mask="00.000.000/0000-00"
                  value={cnpj}
                  onAccept={(value: string) => setCnpj(value)}
                  placeholder="00.000.000/0000-00"
                  className="eco-input"
                  required
                  name="cnpj"
                  id="cnpj"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={telefone}
                  onAccept={(value: string) => setTelefone(value)}
                  placeholder="(00) 00000-0000"
                  className="eco-input"
                  required
                  name="telefone"
                  id="telefone"
                />
              </div>

              <button
                type="submit"
                className="eco-button w-full flex justify-center items-center py-3"
              >
                Criar Conta
              </button>
            </form>

            {erroMensagem && (
              <div className="mt-2 text-xs text-center text-red-600">
                {erroMensagem}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cadastro;
