import React, { useEffect, useState, useCallback } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, AlertCircle, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getSaldoCreditos } from "@/services/getSaldo";
import { venderCreditos } from "@/services/VenderCreditos";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import FooterNav from "@/components/FooterNav"; // Importado aqui

const VALOR_UNITARIO_CREDITO = 0.05;

interface RespostaVenda {
  mensagem?: string;
  msg?: string;
}

const SellCredits: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>("");
  const [saldoCreditos, setSaldoCreditos] = useState<number>(0);
  const [abrirModal, setAbrirModal] = useState(false);
  const [confirmando, setConfirmando] = useState(false);

  const token = localStorage.getItem("token") || "";

  const buscarSaldo = useCallback(async () => {
    try {
      const resposta = await getSaldoCreditos(token);
      setSaldoCreditos(resposta.saldoemconta);
    } catch (error) {
      toast.error("Erro ao buscar saldo de créditos.");
    }
  }, [token]);

  useEffect(() => {
    buscarSaldo();
  }, [buscarSaldo]);

  const quantidade = parseFloat(amount || "0");
  const valorEstimado = quantidade * VALOR_UNITARIO_CREDITO;

  const handleConfirmarVenda = async () => {
    setConfirmando(true);
    try {
      const resposta = await venderCreditos(token, {
        quantidadeCreditos: quantidade,
      });

      let mensagem = "Venda realizada com sucesso.";
      if (typeof resposta === "string") {
        mensagem = resposta;
      } else if (resposta && typeof resposta === "object") {
        const r = resposta as RespostaVenda;
        mensagem = r.mensagem || r.msg || mensagem;
      }

      toast.success(mensagem);
      buscarSaldo();
      setAmount("");
    } catch {
      toast.error("Erro ao vender créditos.");
    } finally {
      setAbrirModal(false);
      setConfirmando(false);
    }
  };

  const handleAbrirModal = () => {
    if (!amount || quantidade <= 0) {
      toast.error("Por favor, informe uma quantidade válida de créditos.");
      return;
    }

    if (quantidade > saldoCreditos) {
      toast.error("Você não possui créditos suficientes.");
      return;
    }

    setAbrirModal(true);
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-28 page-transition">
        {" "}
        {/* espaço extra no padding inferior */}
        <div className="mb-6 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Vender Créditos de Carbono</h1>
        </div>
        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <Leaf className="text-eco-blue-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Seus Créditos Disponíveis</h2>
          </div>
          <div className="flex items-end mb-2">
            <span className="text-2xl font-semibold text-gray-900">
              {saldoCreditos}
            </span>
            <span className="ml-1 text-gray-600 text-sm mb-1">
              Toneladas CO₂
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Valor aproximado: R${" "}
            {(saldoCreditos * VALOR_UNITARIO_CREDITO).toFixed(2)}
          </div>
        </div>
        <div className="mb-6 glass-card p-5 rounded-xl">
          <h2 className="text-lg font-medium mb-4">Quanto deseja vender?</h2>
          <div className="relative mb-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={saldoCreditos}
              step={0.1}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">Ton CO₂</span>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <span>Valor estimado: </span>
            <span className="font-medium text-eco-blue-600">
              R$ {valorEstimado.toFixed(2)}
            </span>
          </div>

          {quantidade > saldoCreditos && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Você não possui créditos suficientes</span>
            </div>
          )}
        </div>
        <div className="glass-card p-5 rounded-xl mb-6">
          <h2 className="text-lg font-medium mb-4">Onde vou receber?</h2>
          <div className="text-sm text-gray-700 leading-relaxed bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
            <p className="mb-2">
              <strong>Conta bancária padrão para recebimento</strong>
            </p>
            <p>
              O valor da venda será creditado automaticamente na sua conta de
              saldo.
              <br />
              Caso deseje sacar esse valor em reais, entre em contato com nossa
              equipe pelo e-mail&nbsp;
              <span className="font-medium text-yellow-900">
                suporte@ecocreditos.com.br
              </span>
              &nbsp;para seguir com o processo de retirada.
            </p>
          </div>
        </div>
        <Button
          onClick={handleAbrirModal}
          className="w-full bg-eco-blue-600 hover:bg-eco-blue-700 py-6"
          disabled={!amount || quantidade <= 0 || quantidade > saldoCreditos}
        >
          Vender Créditos
        </Button>
        {/* Modal de confirmação */}
        <Dialog open={abrirModal} onOpenChange={setAbrirModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Venda</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 text-gray-700">
              <p>
                Você está prestes a vender <strong>{quantidade}</strong>{" "}
                toneladas de CO₂.
              </p>
              <p>
                Você irá receber aproximadamente{" "}
                <strong>R$ {valorEstimado.toFixed(2)}</strong>.
              </p>
            </div>
            <DialogFooter className="pt-4">
              <Button variant="ghost" onClick={() => setAbrirModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmarVenda} disabled={confirmando}>
                {confirmando ? "Processando..." : "Confirmar Venda"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <FooterNav /> {/* Rodapé fixo */}
    </Layout>
  );
};

export default SellCredits;
