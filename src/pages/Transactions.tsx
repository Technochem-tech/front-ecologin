import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import FooterNav from "@/components/FooterNav";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownUp, ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ReceberHistoricoTransacao } from "@/services/transactions";
import QRCode from "react-qr-code";

interface Transaction {
  id: string;
  date: string;
  type: "purchase" | "sale" | "transfer";
  description: string;
  amount: string;
  status: "completed" | "pending" | "failed";
  pix?: string;
}

const mapTipo = (tipo: string): "purchase" | "sale" | "transfer" => {
  const t = tipo.toLowerCase();
  if (t.includes("compra")) return "purchase";
  if (t.includes("venda")) return "sale";
  return "transfer";
};

const mapStatus = (status: string): "completed" | "pending" | "failed" => {
  const s = status.toLowerCase();
  if (s.includes("pendente")) return "pending";
  if (s.includes("concluído") || s.includes("concluido")) return "completed";
  return "failed";
};

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tab, setTab] = useState<"all" | "purchase" | "sale" | "transfer">("all");
  const [filtroData, setFiltroData] = useState("");
  const [pixAtivo, setPixAtivo] = useState<string | null>(null);

  useEffect(() => {
    const carregarTransacoes = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await ReceberHistoricoTransacao(token || "", {});
        const dadosMapeados: Transaction[] = response.map(
          (item: any, index: number) => ({
            id: index.toString(),
            date: new Date(item.dataHora).toLocaleDateString("pt-BR"),
            type: mapTipo(item.tipo),
            description: item.descricao,
            amount: `${item.quantidade >= 0 ? "+" : ""}${item.quantidade} tCO₂`,
            status: mapStatus(item.status),
            pix: item.copiaColaPix || null
          })
        );

        if (filtroData.match(/^\d{2}\/\d{4}$/)) {
          const [mes, ano] = filtroData.split("/");
          const filtrado = dadosMapeados.filter((t) => {
            const [dia, mesTrans, anoTrans] = t.date.split("/");
            return mesTrans === mes && anoTrans === ano;
          });
          setTransactions(filtrado);
        } else {
          setTransactions(dadosMapeados);
        }
      } catch (error) {
        toast.error("Erro ao carregar transações.");
      }
    };

    carregarTransacoes();
  }, [filtroData]);

  const filtrar = (tipo: "all" | "purchase" | "sale" | "transfer") => {
    if (tipo === "all") return transactions;
    return transactions.filter((t) => t.type === tipo);
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-28">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Histórico de Transações</h1>
          <p className="text-sm text-gray-600">Acompanhe todas as suas movimentações</p>
        </header>

        <div className="mb-6 relative">
          <div className="flex items-center border rounded-lg overflow-hidden bg-white">
            <div className="px-3 py-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Digite mês e ano (ex: 09/2025)"
              value={filtroData}
              onChange={(e) => {
                let valor = e.target.value.replace(/\D/g, "");
                if (valor.length > 6) valor = valor.slice(0, 6);
                let formatado = valor;
                if (valor.length >= 3) {
                  formatado = valor.slice(0, 2) + "/" + valor.slice(2);
                }
                setFiltroData(formatado);
              }}
              className="flex-1 py-2 px-2 outline-none text-sm"
            />
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full bg-eco-green-50 p-1 rounded-lg">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="purchase">Compras</TabsTrigger>
            <TabsTrigger value="sale">Vendas</TabsTrigger>
            <TabsTrigger value="transfer">Transferências</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TransactionTable transactions={filtrar("all")} setPixAtivo={setPixAtivo} />
          </TabsContent>
          <TabsContent value="purchase" className="mt-4">
            <TransactionTable transactions={filtrar("purchase")} setPixAtivo={setPixAtivo} />
          </TabsContent>
          <TabsContent value="sale" className="mt-4">
            <TransactionTable transactions={filtrar("sale")} setPixAtivo={setPixAtivo} />
          </TabsContent>
          <TabsContent value="transfer" className="mt-4">
            <TransactionTable transactions={filtrar("transfer")} setPixAtivo={setPixAtivo} />
          </TabsContent>
        </Tabs>

        {pixAtivo && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg relative max-w-sm w-full">
              <button onClick={() => setPixAtivo(null)} className="absolute top-2 right-2">
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-bold mb-4 text-center">Pagamento Pendente</h2>
              <div className="flex justify-center mb-4">
                <QRCode value={pixAtivo} size={160} />
              </div>
              <p className="text-sm text-gray-600 break-all mb-4">{pixAtivo}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(pixAtivo);
                  toast.success("PIX copiado!");
                }}
                className="w-full bg-eco-green-600 hover:bg-eco-green-700 text-white py-2 rounded"
              >
                Copiar PIX
              </button>
            </div>
          </div>
        )}
      </div>

      <FooterNav />
    </Layout>
  );
};

const TransactionTable: React.FC<{ transactions: Transaction[], setPixAtivo: (v: string) => void }> = ({
  transactions,
  setPixAtivo
}) => {
  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[100px]">Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Quantidade</TableHead>
            <TableHead className="text-right w-[100px]">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                Nenhuma transação encontrada
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className={transaction.status === "pending" ? "cursor-pointer hover:bg-yellow-50" : ""}
                onClick={() => {
                  if (transaction.status === "pending" && transaction.pix) {
                    setPixAtivo(transaction.pix);
                  }
                }}
              >
                <TableCell className="font-medium">{transaction.date}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="p-1 rounded-full mr-2 bg-gray-100">
                      {transaction.type === "purchase" && <ArrowDown className="h-4 w-4 text-eco-green-500" />}
                      {transaction.type === "sale" && <ArrowUp className="h-4 w-4 text-eco-blue-500" />}
                      {transaction.type === "transfer" && <ArrowDownUp className="h-4 w-4 text-gray-500" />}
                    </span>
                    {transaction.description}
                  </div>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "purchase"
                      ? "text-eco-green-500"
                      : transaction.type === "sale"
                      ? "text-eco-blue-500"
                      : "text-gray-600"
                  }`}
                >
                  {transaction.amount}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status === "completed" && "Concluído"}
                    {transaction.status === "pending" && "Pendente"}
                    {transaction.status === "failed" && "Falhou"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Transactions;
