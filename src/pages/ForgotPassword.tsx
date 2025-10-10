import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { solicitarRedefinicao } from "@/services/resetPassword";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEnviar = async () => {
    setLoading(true);
    try {
      await solicitarRedefinicao(email);
      toast.success("Link de redefinição enviado para o e-mail!");
      setEmail("");
    } catch (error) {
      const err = error as AxiosError;
      let mensagem = "Erro ao solicitar redefinição. Verifique o e-mail.";

      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          mensagem = data;
        } else if (typeof data === "object" && "mensagem" in data) {
          mensagem = (data as { mensagem: string }).mensagem;
        }
      }

      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Botão de voltar, agora dentro da área centralizada */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-eco-green-600 hover:text-eco-green-700"
          >
            <ArrowLeft className="mr-2" />
            Voltar
          </button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Esqueci minha senha
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Informe seu e-mail para receber o link de redefinição
            </p>
          </div>

          <div className="glass-card rounded-2xl shadow-lg px-6 py-8">
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="eco-input"
              />
              <button
                onClick={handleEnviar}
                className="eco-button w-full py-3 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
