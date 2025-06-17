
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, User, Send, Banknote, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from "sonner";

const Transfer: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [transferType, setTransferType] = useState<'money' | 'credits'>('money');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleTransfer = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor, informe um valor válido.");
      return;
    }
    
    if (!recipient) {
      toast.error("Por favor, informe o destinatário.");
      return;
    }
    
    if (transferType === 'money' && parseFloat(amount) > 2500) {
      toast.error("Saldo insuficiente para esta transferência.");
      return;
    }
    
    if (transferType === 'credits' && parseFloat(amount) > 3.2) {
      toast.error("Créditos insuficientes para esta transferência.");
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmTransfer = () => {
    const typeText = transferType === 'money' ? 'R$' : 'créditos de carbono';
    toast.success(`Transferência de ${amount} ${typeText} realizada com sucesso!`);
    setShowConfirmation(false);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-20 page-transition">
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/dashboard')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Transferir</h1>
        </div>
        
        <Tabs defaultValue="money" onValueChange={(value) => setTransferType(value as 'money' | 'credits')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="money">Dinheiro</TabsTrigger>
            <TabsTrigger value="credits">Créditos de Carbono</TabsTrigger>
          </TabsList>
          
          <TabsContent value="money" className="space-y-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex items-center mb-4">
                <Banknote className="text-eco-green-500 mr-2 h-5 w-5" />
                <h2 className="text-lg font-medium">Saldo Disponível</h2>
              </div>
              <div className="text-2xl font-semibold text-gray-900">R$ 2.500,00</div>
            </div>
          </TabsContent>
          
          <TabsContent value="credits" className="space-y-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex items-center mb-4">
                <Leaf className="text-eco-blue-500 mr-2 h-5 w-5" />
                <h2 className="text-lg font-medium">Créditos Disponíveis</h2>
              </div>
              <div className="flex items-end">
                <span className="text-2xl font-semibold text-gray-900">3.2</span>
                <span className="ml-1 text-gray-600 text-sm mb-1">Toneladas CO₂</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <User className="text-gray-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Para quem você quer transferir?</h2>
          </div>
          <Input
            placeholder="Email, CPF ou nome de usuário"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="mb-4"
          />
          
          <div className="flex items-center mb-4">
            <Send className="text-gray-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Quanto você quer transferir?</h2>
          </div>
          <div className="relative">
            {transferType === 'money' && (
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">R$</span>
              </div>
            )}
            <Input
              type="number"
              placeholder="0.00"
              className={transferType === 'money' ? 'pl-10' : ''}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step={transferType === 'credits' ? '0.1' : '0.01'}
            />
            {transferType === 'credits' && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">Ton CO₂</span>
              </div>
            )}
          </div>
          
          {transferType === 'money' && parseFloat(amount || '0') > 2500 && (
            <div className="mt-2 text-sm text-red-500">
              Saldo insuficiente para esta transferência.
            </div>
          )}
          
          {transferType === 'credits' && parseFloat(amount || '0') > 3.2 && (
            <div className="mt-2 text-sm text-red-500">
              Créditos insuficientes para esta transferência.
            </div>
          )}
        </div>
        
        <Button 
          onClick={handleTransfer}
          className="w-full bg-eco-green-600 hover:bg-eco-green-700 py-6"
          disabled={
            !amount || 
            parseFloat(amount) <= 0 || 
            !recipient || 
            (transferType === 'money' && parseFloat(amount) > 2500) ||
            (transferType === 'credits' && parseFloat(amount) > 3.2)
          }
        >
          Transferir {transferType === 'money' ? 'Dinheiro' : 'Créditos'}
        </Button>
        
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Transferência</DialogTitle>
              <DialogDescription>
                Você está transferindo {transferType === 'money' ? `R$ ${amount}` : `${amount} Toneladas CO₂`} para {recipient}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmTransfer}>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Transfer;
