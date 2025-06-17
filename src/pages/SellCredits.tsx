
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CreditCard, AlertCircle, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import BankAccountForm from '@/components/BankAccountForm';
import { toast } from "sonner";

const SellCredits: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [selectedAccount, setSelectedAccount] = useState<number | null>(0); // Default to first account
  
  const accounts = [
    {
      id: 1,
      bankName: 'Banco do Brasil',
      accountType: 'Conta Corrente',
      accountNumber: '12345-6',
      agency: '1234',
    }
  ];

  const handleSell = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor, informe uma quantidade válida de créditos.");
      return;
    }
    
    if (parseFloat(amount) > 3.2) {
      toast.error("Você não possui créditos suficientes.");
      return;
    }
    
    if (selectedAccount === null) {
      toast.error("Por favor, selecione uma conta para receber o valor.");
      return;
    }
    
    toast.success(`Venda de ${amount} toneladas de CO₂ realizada com sucesso!`);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const calculatedValue = parseFloat(amount || '0') * 40; // R$40 por tonelada

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
          <h1 className="text-2xl font-bold">Vender Créditos de Carbono</h1>
        </div>
        
        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <Leaf className="text-eco-blue-500 mr-2 h-5 w-5" />
            <h2 className="text-lg font-medium">Seus Créditos Disponíveis</h2>
          </div>
          <div className="flex items-end mb-4">
            <span className="text-2xl font-semibold text-gray-900">3.2</span>
            <span className="ml-1 text-gray-600 text-sm mb-1">Toneladas CO₂</span>
          </div>
          <div className="text-sm text-gray-500">Valor aproximado: R$ 128,00</div>
        </div>
        
        <div className="mb-6 glass-card p-5 rounded-xl">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-medium">Quanto deseja vender?</h2>
          </div>
          <div className="mb-2">
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={3.2}
                step={0.1}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500">Ton CO₂</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center justify-between">
            <span>Valor estimado:</span>
            <span className="font-medium text-eco-blue-600">R$ {calculatedValue.toFixed(2)}</span>
          </div>
          {parseFloat(amount || '0') > 3.2 && (
            <div className="mt-2 text-sm text-red-500 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Você não possui créditos suficientes</span>
            </div>
          )}
        </div>
        
        <div className="glass-card p-5 rounded-xl mb-6">
          <h2 className="text-lg font-medium mb-4">Receber em</h2>
          <div className="space-y-3">
            {accounts.map((account, index) => (
              <div 
                key={account.id}
                className={`flex items-center justify-between p-3 bg-white rounded-lg border ${
                  selectedAccount === index ? 'border-eco-blue-500' : 'border-gray-200'
                }`}
                onClick={() => setSelectedAccount(index)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-eco-blue-100 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="h-5 w-5 text-eco-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{account.bankName}</h3>
                    <p className="text-sm text-gray-500">
                      {account.accountType} - Ag: {account.agency} Conta: {account.accountNumber}
                    </p>
                  </div>
                </div>
                <input 
                  type="radio" 
                  name="account" 
                  checked={selectedAccount === index}
                  onChange={() => setSelectedAccount(index)}
                  className="h-4 w-4 text-eco-blue-600" 
                />
              </div>
            ))}
            
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
        
        <Button 
          onClick={handleSell}
          className="w-full bg-eco-blue-600 hover:bg-eco-blue-700 py-6"
          disabled={
            !amount || 
            parseFloat(amount) <= 0 || 
            parseFloat(amount) > 3.2 || 
            selectedAccount === null
          }
        >
          Vender Créditos
        </Button>
      </div>
    </Layout>
  );
};

export default SellCredits;
