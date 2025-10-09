import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Leaf, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ListarProjetos } from "@/services/projetos";
import {
  iniciarCompra,
  verificarStatusPagamento,
} from "@/services/ComprarCreditos";
import QRCode from "react-qr-code";
import FooterNav from "@/components/FooterNav";

interface Projeto {
  id: number;
  titulo: string;
  valor: number;
  descricao: string;
  imgBase64: string;
  creditosDisponivel: number;
}

interface CompraResponse {
  qrCode: string;
  pagamentoId: string;
}

const BuyCredits: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(false);
  const [compra, setCompra] = useState<CompraResponse | null>(null);

  const TONELADAS_MINIMAS = 0.01;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Token não encontrado. Faça login.");
      navigate("/");
      return;
    }

    ListarProjetos(token)
      .then((lista) => setProjects(lista))
      .catch(() => toast.error("Erro ao carregar projetos."));
  }, [navigate]);

  useEffect(() => {
    if (!compra?.pagamentoId) return;

    const interval = setInterval(async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const statusResp = await verificarStatusPagamento(
          token,
          compra.pagamentoId
        );
        const status = statusResp.status.toLowerCase();

        if (status === "approved") {
          toast.success("✅ Pagamento aprovado com sucesso!");
          clearInterval(interval);
        }
      } catch {
        // erro silencioso
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [compra]);

  const toneladasAproximadas = () => {
    if (!amount || selectedProject === null) return "0.00";
    const valor = parseFloat(amount);
    if (isNaN(valor) || valor <= 0) return "0.00";

    const precoTonelada = projects[selectedProject]?.valor || 1;
    return (valor / precoTonelada).toFixed(2);
  };

  const handleBuy = async () => {
    const toneladas = parseFloat(toneladasAproximadas());

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor, informe um valor válido.");
      return;
    }
    if (selectedProject === null) {
      toast.error("Por favor, selecione um projeto.");
      return;
    }
    if (toneladas < TONELADAS_MINIMAS) {
      toast.error(
        `O valor mínimo precisa resultar em pelo menos ${TONELADAS_MINIMAS.toFixed(
          2
        )} toneladas de CO₂.`
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Faça login para continuar.");
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const dadosCompra = {
        valorReais: parseFloat(amount),
        idProjeto: projects[selectedProject].id,
      };

      const response = await iniciarCompra(token, dadosCompra);
      setCompra(response);
      toast.success("Compra iniciada com sucesso!");
    } catch (error) {
      if (error.response?.data?.erro) {
        toast.error(error.response.data.erro);
      } else {
        toast.error("Erro ao iniciar compra.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    if (selectedProject === null) {
      toast.warning("Selecione um projeto antes de digitar o valor.");
    }
    setAmount(value);
  };

  const checarStatusPagamento = async () => {
    const token = localStorage.getItem("token");
    if (!token || !compra?.pagamentoId) {
      toast.error("Nenhum pagamento para verificar.");
      return;
    }

    try {
      const statusResp = await verificarStatusPagamento(
        token,
        compra.pagamentoId
      );
      const status = statusResp.status.toLowerCase();

      if (status === "approved") {
        toast.success("✅ Pagamento aprovado com sucesso!");
      } else if (status === "pending") {
        toast.warning("⏳ Pagamento ainda está pendente.");
      } else if (status === "expired") {
        toast.error("❌ Pagamento expirado. Tente novamente.");
      } else {
        toast(`⚠️ Status do pagamento: ${status}`);
      }
    } catch {
      toast.error("Erro ao verificar status do pagamento.");
    }
  };

  return (
    <>
      <Layout showNavbar>
        <div className="min-h-screen pt-6 pb-28 page-transition">
          <div className="mb-6 flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Comprar Créditos de Carbono</h1>
          </div>

          {/* VALOR */}
          <div className="mb-6 glass-card p-5 rounded-xl">
            <div className="flex items-center mb-4">
              <Leaf className="text-eco-green-500 mr-2 h-5 w-5" />
              <h2 className="text-lg font-medium">
                Quanto você quer investir?
              </h2>
            </div>
            <div className="mb-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  SCB
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-12" // mais espaço à esquerda
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
              </div>
            </div>
            <div className="text-sm text-gray-500 flex items-center">
              <Info className="h-4 w-4 mr-1" />
              <span>
                Aproximadamente {toneladasAproximadas()} toneladas de CO₂
              </span>
            </div>
          </div>

          {/* PROJETOS */}
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Selecione um projeto</h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all ${
                    selectedProject === index ? "ring-2 ring-eco-green-500" : ""
                  }`}
                  onClick={() => setSelectedProject(index)}
                >
                  <div className="flex">
                    <div className="w-24 h-24 overflow-hidden rounded-l-xl">
                      <img
                        src={`data:image/jpeg;base64,${project.imgBase64}`}
                        alt={project.titulo}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="font-medium">{project.titulo}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">
                        {project.descricao}
                      </p>
                      <p className="text-eco-green-600 font-medium mt-2">
                        SCB {project.valor.toFixed(2)}/tonelada
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {project.creditosDisponivel}T disponíveis
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* PAGAMENTO */}
          <div className="glass-card p-5 rounded-xl mb-6">
            <h2 className="text-lg font-medium mb-4">Método de Pagamento</h2>
            <div className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-eco-green-100 rounded-full flex items-center justify-center mr-3">
                  <ShoppingCart className="h-5 w-5 text-eco-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Pagamento via PIX</h3>
                  <p className="text-sm text-gray-500">Aprovação instantânea</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                checked
                readOnly
                className="h-4 w-4 text-eco-green-600"
              />
            </div>
          </div>

          {/* BOTÃO - só aparece se ainda não iniciou compra */}
          {!compra && (
            <Button
              onClick={handleBuy}
              className="w-full bg-eco-green-600 hover:bg-eco-green-700 py-6"
              disabled={
                !amount ||
                parseFloat(amount) <= 0 ||
                selectedProject === null ||
                parseFloat(toneladasAproximadas()) < TONELADAS_MINIMAS
              }
            >
              Finalizar Compra
            </Button>
          )}

          {/* QRCODE E BOTÃO STATUS */}
          {compra && (
            <div className="mt-6 p-6 bg-white rounded-xl border shadow-md flex flex-col items-center space-y-6 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-800">
                Finalize seu pagamento
              </h3>

              <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
                <QRCode value={compra.qrCode} size={200} />
              </div>

              <div className="w-full text-left space-y-3 text-gray-700 text-sm">
                <p>
                  <strong>💰 Valor:</strong> SCB {parseFloat(amount).toFixed(2)}
                </p>
                <p>
                  <strong>🧾 ID do Pagamento:</strong> {compra.pagamentoId}
                </p>

                <div>
                  <p className="font-semibold mb-2">📋 PIX Copia e Cola:</p>
                  <div className="flex items-center bg-gray-100 p-3 rounded-md border border-gray-300 break-all select-text">
                    <span className="flex-1 text-xs">{compra.qrCode}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(compra.qrCode);
                        toast.success(
                          "PIX copiado para a área de transferência!"
                        );
                      }}
                      aria-label="Copiar PIX"
                      className="ml-3 flex items-center gap-1 px-3 py-1 bg-eco-green-600 hover:bg-eco-green-700 text-white rounded-md transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 16h8M8 12h8m-7-8h6a2 2 0 012 2v12a2 2 0 01-2 2h-6a2 2 0 01-2-2V6a2 2 0 012-2z"
                        />
                      </svg>
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={checarStatusPagamento}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4"
              >
                Já fez o pagamento?
              </Button>
            </div>
          )}
        </div>
      </Layout>

      <FooterNav />
    </>
  );
};

export default BuyCredits;
