import React from 'react';
import Layout from '@/components/Layout';
import FooterNav from '@/components/FooterNav'; // ⬅️ Adicionado
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  ArrowDownUp,
  ArrowUp,
  ArrowDown,
  Search
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';

interface Transaction {
  id: string;
  date: string;
  type: 'purchase' | 'sale' | 'transfer';
  description: string;
  amount: string;
  status: 'completed' | 'pending' | 'failed';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '15/06/2023',
    type: 'purchase',
    description: 'Compra de créditos Reflorestamento Amazônia',
    amount: '+2.0 tCO₂',
    status: 'completed'
  },
  {
    id: '2',
    date: '10/06/2023',
    type: 'sale',
    description: 'Venda de créditos Energia Solar',
    amount: '-1.5 tCO₂',
    status: 'completed'
  },
  {
    id: '3',
    date: '05/06/2023',
    type: 'transfer',
    description: 'Transferência para Maria Silva',
    amount: '-0.5 tCO₂',
    status: 'completed'
  },
  {
    id: '4',
    date: '01/06/2023',
    type: 'purchase',
    description: 'Compra de créditos Biodigestores Rurais',
    amount: '+1.0 tCO₂',
    status: 'pending'
  },
  {
    id: '5',
    date: '28/05/2023',
    type: 'purchase',
    description: 'Compra de créditos Energia Solar',
    amount: '+0.8 tCO₂',
    status: 'completed'
  },
  {
    id: '6',
    date: '20/05/2023',
    type: 'sale',
    description: 'Venda de créditos Reflorestamento',
    amount: '-1.2 tCO₂',
    status: 'failed'
  },
  {
    id: '7',
    date: '15/05/2023',
    type: 'transfer',
    description: 'Transferência para Carlos Mendes',
    amount: '-0.3 tCO₂',
    status: 'completed'
  }
];

const Transactions: React.FC = () => {
  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-28"> {/* espaço extra p/ o footer */}
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
              placeholder="Buscar transação..."
              className="flex-1 py-2 px-2 outline-none text-sm"
            />
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-4 w-full bg-eco-green-50 p-1 rounded-lg">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">Todas</TabsTrigger>
            <TabsTrigger value="purchase" className="data-[state=active]:bg-white">Compras</TabsTrigger>
            <TabsTrigger value="sale" className="data-[state=active]:bg-white">Vendas</TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-white">Transferências</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TransactionTable transactions={mockTransactions} />
          </TabsContent>

          <TabsContent value="purchase" className="mt-4">
            <TransactionTable transactions={mockTransactions.filter(t => t.type === 'purchase')} />
          </TabsContent>

          <TabsContent value="sale" className="mt-4">
            <TransactionTable transactions={mockTransactions.filter(t => t.type === 'sale')} />
          </TabsContent>

          <TabsContent value="transfer" className="mt-4">
            <TransactionTable transactions={mockTransactions.filter(t => t.type === 'transfer')} />
          </TabsContent>
        </Tabs>
      </div>

      <FooterNav /> {/* ⬅️ Componente de navegação inferior */}
    </Layout>
  );
};

const TransactionTable: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
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
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.date}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <span className="p-1 rounded-full mr-2 bg-gray-100">
                      {transaction.type === 'purchase' && <ArrowDown className="h-4 w-4 text-eco-green-500" />}
                      {transaction.type === 'sale' && <ArrowUp className="h-4 w-4 text-eco-blue-500" />}
                      {transaction.type === 'transfer' && <ArrowDownUp className="h-4 w-4 text-gray-500" />}
                    </span>
                    {transaction.description}
                  </div>
                </TableCell>
                <TableCell className={`text-right font-medium ${
                  transaction.type === 'purchase'
                    ? 'text-eco-green-500'
                    : transaction.type === 'sale'
                      ? 'text-eco-blue-500'
                      : 'text-gray-600'
                }`}>
                  {transaction.amount}
                </TableCell>
                <TableCell className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status === 'completed' && 'Concluído'}
                    {transaction.status === 'pending' && 'Pendente'}
                    {transaction.status === 'failed' && 'Falhou'}
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
