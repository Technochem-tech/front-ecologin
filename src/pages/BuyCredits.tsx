import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ShoppingCart, Leaf, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import BankAccountForm from "@/components/BankAccountForm";
import { toast } from "sonner";
import { ListarProjetos } from "@/services/projetos";
import { iniciarCompra } from "@/services/ComprarCreditos"; // seu serviço API
import QRCode from "react-qr-code";

interface Projeto {
  id: number;
  titulo: string;
  valor: number; // preço por tonelada
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
  const [saldo, setSaldo] = useState<number>(0);

  // Carregar projetos
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

  // Buscar saldo em conta
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
 
    
  }, [navigate]);

  // Cálculo toneladas conforme valor e projeto selecionado
  const toneladasAproximadas = () => {
    if (!amount || selectedProject === null) return "0.00";
    const valor = parseFloat(amount);
    if (isNaN(valor) || valor <= 0) return "0.00";

    const precoTonelada = projects[selectedProject]?.valor || 1;
    return (valor / precoTonelada).toFixed(2);
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor, informe um valor válido.");
      return;
    }
    if (selectedProject === null) {
      toast.error("Por favor, selecione um projeto.");
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
      // tratarErroAPI já exibe toast, aqui só garantir loading false
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-20 page-transition max-w-3xl mx-auto">
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

        {/* Investimento */}
        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <Leaf className="text-eco-green-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Quanto você quer investir?</h2>
          </div>
          <div className="mb-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">R$</span>
              </div>
              <Input
                type="number"
                placeholder="0.00"
                className="pl-10"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.01"
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

        {/* Projetos */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Selecione um projeto</h2>
          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all ${
                    selectedProject === index
                      ? "ring-2 ring-eco-green-500"
                      : ""
                  }`}
                  onClick={() => setSelectedProject(index)}
                >
                  <div className="flex items-stretch">
                    <div className="w-24 h-auto aspect-square">
                      <img
                        src={`data:image/jpeg;base64,${project.imgBase64}`}
                        alt={project.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium">{project.titulo}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {project.descricao}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                        <p className="text-eco-green-600 font-medium text-sm">
                          R$ {project.valor.toFixed(2)}/tonelada
                        </p>
                        <p className="text-xs text-gray-500 mt-1 sm:mt-0">
                          {project.creditosDisponivel}t disponíveis
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <p>Carregando projetos...</p>
            )}
          </div>
        </div>

        {/* Método de pagamento */}
        <div className="glass-card p-5 rounded-xl mb-6">
          <h2 className="text-lg font-medium mb-4">Método de Pagamento</h2>
          <div className="space-y-3">
            {/* Saldo Disponível - não clicável */}
            <div
              className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-gray-300 cursor-not-allowed opacity-50"
              title="Ainda não disponível"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-eco-green-100 rounded-full flex items-center justify-center mr-3">
                  <ShoppingCart className="h-5 w-5 text-eco-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Saldo Disponível</h3>
                  <p className="text-sm text-gray-500">
                    R$ {saldo.toFixed(2)}
                  </p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                disabled
                className="h-4 w-4 text-eco-green-600"
              />
            </div>

            {/* PIX - ativo */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 cursor-pointer">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-eco-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-eco-green-600 font-bold text-lg">PIX</span>
                </div>
                <div>
                  <h3 className="font-medium">PIX</h3>
                  <p className="text-sm text-gray-500">Pagamento instantâneo</p>
                </div>
              </div>
              <input
                type="radio"
                name="payment"
                defaultChecked
                className="h-4 w-4 text-eco-green-600"
              />
            </div>

            {/* Adicionar Conta Bancária */}
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <span className="mr-2">+</span> Adicionar Conta Bancária
                </Button>
              </DrawerTrigger>
              <DrawerContent className="p-6">
                <DrawerHeader>
                  <DrawerTitle>Cadastrar Conta Bancária</DrawerTitle>
                </DrawerHeader>
                <BankAccountForm />
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        {/* Botão Finalizar Compra */}
        <Button
          onClick={handleBuy}
          className="w-full bg-eco-green-600 hover:bg-eco-green-700 py-6"
          disabled={
            !amount || parseFloat(amount) <= 0 || selectedProject === null || loading
          }
        >
          {loading ? "Processando..." : "Finalizar Compra"}
        </Button>

        {/* Mostrar QR Code e pagamentoId após compra */}
        {compra && (
          <div className="mt-8 p-6 border rounded-xl bg-white max-w-md mx-auto shadow-md text-center">
            <h3 className="text-xl font-semibold mb-4">Pagamento Iniciado</h3>
            <p className="mb-2">
              <strong>ID do Pagamento:</strong> {compra.pagamentoId}
            </p>
            <div className="bg-white inline-block p-4 rounded-lg shadow-md mx-auto">
              <QRCode value={compra.qrCode} size={180} />
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Use o QR code para finalizar o pagamento via PIX.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BuyCredits;
