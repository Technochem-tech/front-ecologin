import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import {
  VerificarDestinatario,
  ConfirmarTransferenciaCredito,
} from "@/services/transfer";

import { getSaldo, getSaldoCreditos } from "@/services/getBalance";
import FooterNav from "@/components/FooterNav"; // <== Rodapé adicionado aqui

interface Destinatario {
  nome: string;
  email: string;
  cnpj: string;
}

interface ApiError {
  response?: {
    data?: {
      mensagem?: string;
    };
  };
}

const Transfer: React.FC = () => {
  const navigate = useNavigate();

  const [recipientInput, setRecipientInput] = useState("");
  const [recipientData, setRecipientData] = useState<Destinatario | null>(null);
  const [recipientModalOpen, setRecipientModalOpen] = useState(false);
  const [recipientError, setRecipientError] = useState<string | null>(null);

  const [amount, setAmount] = useState("");
  const [descricao, setDescricao] = useState("");
  const [canEditAmount, setCanEditAmount] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [saldoCreditos, setSaldoCreditos] = useState(0);
  const [saldoDinheiro, setSaldoDinheiro] = useState(0);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    async function carregarSaldos() {
      if (!token) return;
      try {
        const saldoData = await getSaldo(token);
        setSaldoDinheiro(saldoData.saldoemconta);
      } catch (error) {
        console.error("Erro ao buscar saldo dinheiro", error);
      }

      try {
        const saldoCreditoData = await getSaldoCreditos(token);
        setSaldoCreditos(saldoCreditoData.saldoemconta);
      } catch (error) {
        console.error("Erro ao buscar saldo créditos", error);
      }
    }
    carregarSaldos();
  }, [token]);

  const handleCheckRecipient = async () => {
    if (!recipientInput.trim()) {
      toast.error("Informe o email ou CNPJ do destinatário.");
      return;
    }

    setLoading(true);
    setRecipientError(null);

    try {
      const data = await VerificarDestinatario(token, recipientInput.trim());
      setRecipientData(data);
      setRecipientModalOpen(true);
    } catch (error: unknown) {
      const err = error as ApiError;
      const mensagem =
        err?.response?.data?.mensagem || "Destinatário não encontrado.";
      setRecipientError(mensagem);
      setRecipientData(null);
      setRecipientModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmRecipient = () => {
    setRecipientModalOpen(false);
    setCanEditAmount(true);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (parseFloat(val) > saldoCreditos) {
      toast.error("Créditos insuficientes para esta transferência.");
    }
    setAmount(val);
  };

  const handleTransferClick = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Informe um valor válido.");
      return;
    }
    if (parseFloat(amount) > saldoCreditos) {
      toast.error("Créditos insuficientes.");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmTransfer = async () => {
    if (!recipientData) {
      toast.error("Dados do destinatário ausentes.");
      return;
    }

    setLoading(true);
    try {
      await ConfirmarTransferenciaCredito(token, {
        destinatarioEmailOuCnpj: recipientData.email || recipientData.cnpj,
        quantidadeCredito: parseFloat(amount),
        descricao: descricao.trim(),
      });

      toast.success(
        `Transferência de ${amount} créditos de carbono realizada com sucesso!`
      );

      setShowConfirmation(false);
      setAmount("");
      setDescricao("");
      setRecipientInput("");
      setRecipientData(null);
      setCanEditAmount(false);
      setRecipientError(null);
    } catch (error: unknown) {
      const err = error as ApiError;
      const mensagem =
        err?.response?.data?.mensagem || "Erro ao confirmar transferência.";
      toast.error(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
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
          <h1 className="text-2xl font-bold">Transferir Créditos de Carbono</h1>
        </div>

        <div className="mb-2 text-sm text-gray-600">
          Saldo disponível:{" "}
          <strong>
            {saldoCreditos.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            Ton CO₂
          </strong>
        </div>

        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <User className="text-gray-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">
              Para quem você quer transferir?
            </h2>
          </div>
          <Input
            placeholder="Email ou CNPJ"
            value={recipientInput}
            onChange={(e) => setRecipientInput(e.target.value)}
            onBlur={handleCheckRecipient}
            disabled={loading || canEditAmount}
          />
        </div>

        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <Send className="text-gray-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">
              Quanto você quer transferir?
            </h2>
          </div>
          <div className="relative">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              step="0.1"
              disabled={!canEditAmount || loading}
              min={0}
              max={saldoCreditos}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">Ton CO₂</span>
            </div>
          </div>
          {parseFloat(amount || "0") > saldoCreditos && (
            <div className="mt-2 text-sm text-red-500">
              Créditos insuficientes para esta transferência.
            </div>
          )}

          <div className="mt-4">
            <Input
              placeholder="Descrição (opcional)"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              disabled={!canEditAmount || loading}
            />
          </div>
        </div>

        <Button
          onClick={handleTransferClick}
          className="w-full bg-eco-green-600 hover:bg-eco-green-700 py-6"
          disabled={
            loading ||
            !amount ||
            parseFloat(amount) <= 0 ||
            !recipientInput.trim() ||
            parseFloat(amount) > saldoCreditos ||
            !canEditAmount
          }
        >
          Transferir Créditos
        </Button>

        {/* Modal do destinatário */}
        <Dialog open={recipientModalOpen} onOpenChange={setRecipientModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Destinatário</DialogTitle>
              <DialogDescription asChild>
                <>
                  {recipientError ? (
                    <span className="text-red-600">{recipientError}</span>
                  ) : recipientData ? (
                    <>
                      <p>Nome: {recipientData.nome}</p>
                      <p>Email: {recipientData.email}</p>
                      <p>CNPJ: {recipientData.cnpj}</p>
                      <p>Confirma este destinatário?</p>
                    </>
                  ) : (
                    <span>Carregando...</span>
                  )}
                </>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRecipientModalOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              {!recipientError && (
                <Button onClick={handleConfirmRecipient} disabled={loading}>
                  Confirmar
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de confirmação da transferência */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Transferência</DialogTitle>
              <DialogDescription>
                Você está transferindo {amount} Toneladas CO₂ para{" "}
                {recipientData?.nome || recipientInput}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button onClick={confirmTransfer} disabled={loading}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <FooterNav /> {/* <- Rodapé fixo aqui */}
    </Layout>
  );
};

export default Transfer;
