import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Layout from "@/components/Layout";
import { validarToken, atualizarSenha } from "@/services/resetPassword";
import { toast } from "sonner";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroMensagem, setErroMensagem] = useState<string | null>(null);
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  useEffect(() => {
    async function checarToken() {
      const valido = await validarToken(token);
      setTokenValido(valido);
    }
    checarToken();
  }, [token]);

  const validarSenha = (senha: string) =>
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(senha);

  const handleSalvar = async () => {
    setErroMensagem(null);

    if (!validarSenha(novaSenha)) {
      setErroMensagem(
        "A senha deve conter ao menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroMensagem("As senhas não coincidem.");
      return;
    }

    try {
      await atualizarSenha(token, novaSenha);
      toast.success("Senha redefinida com sucesso!");
      // Redirecionar para a tela de login após 3 segundos
      setTimeout(() => navigate("/"), 3000);
    } catch {
      toast.error("Erro ao redefinir a senha.");
    }
  };

  if (tokenValido === false)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-600 font-semibold">
            Token inválido ou expirado.
          </p>
        </div>
      </Layout>
    );

  if (tokenValido === null)
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Verificando token...</p>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/")} // Corrigido para ir para a tela de login
          className="self-start mb-6 flex items-center text-eco-green-600 hover:text-eco-green-700"
        >
          <ArrowLeft className="mr-2" />
          Voltar
        </button>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Redefinir Senha
            </h1>
            <p className="text-sm text-gray-600 mt-1">Digite sua nova senha</p>
          </div>

          <div className="glass-card rounded-2xl shadow-lg px-6 py-8">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="novaSenha"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    id="novaSenha"
                    name="novaSenha"
                    type={mostrarSenha ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="eco-input pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    aria-label={
                      mostrarSenha ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmarSenha"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirmar Senha
                </label>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type={mostrarSenha ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="eco-input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                onClick={handleSalvar}
                className="eco-button w-full flex justify-center items-center py-3"
              >
                Redefinir senha
              </button>

              {erroMensagem && (
                <div className="mt-2 text-xs text-center text-red-600">
                  {erroMensagem}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
