
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ShoppingCart, Leaf, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import BankAccountForm from '@/components/BankAccountForm';
import { toast } from "sonner";

const BuyCredits: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  const projects = [
    {
      id: 1,
      title: 'Reflorestamento Amazônia',
      description: 'Projeto de recuperação de áreas degradadas na Amazônia Brasileira.',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1586974710160-55f48f417990?q=80&w=2564&auto=format&fit=crop'
    },
    {
      id: 2,
      title: 'Energia Solar Nordeste',
      description: 'Implementação de painéis solares em comunidades rurais do nordeste.',
      price: 38.50,
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2672&auto=format&fit=crop'
    },
    {
      id: 3,
      title: 'Biodigestores Rurais',
      description: 'Conversão de resíduos orgânicos em energia limpa para propriedades rurais.',
      price: 42.75,
      image: 'https://images.unsplash.com/photo-1588781290459-fdb581c77cb4?q=80&w=2670&auto=format&fit=crop'
    }
  ];

  const handleBuy = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Por favor, informe um valor válido.");
      return;
    }
    
    if (selectedProject === null) {
      toast.error("Por favor, selecione um projeto.");
      return;
    }
    
    toast.success(`Compra de ${amount} créditos do projeto ${projects[selectedProject].title} realizada com sucesso!`);
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
          <h1 className="text-2xl font-bold">Comprar Créditos de Carbono</h1>
        </div>
        
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
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            <span>Aproximadamente {(parseFloat(amount || '0') / 40).toFixed(2)} toneladas de CO₂</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Selecione um projeto</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <Card 
                key={project.id} 
                className={`cursor-pointer transition-all ${selectedProject === index ? 'ring-2 ring-eco-green-500' : ''}`}
                onClick={() => setSelectedProject(index)}
              >
                <div className="flex">
                  <div className="w-24 h-24 overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
                    <p className="text-eco-green-600 font-medium mt-2">R$ {project.price.toFixed(2)}/tonelada</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="glass-card p-5 rounded-xl mb-6">
          <h2 className="text-lg font-medium mb-4">Método de Pagamento</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-eco-green-100 rounded-full flex items-center justify-center mr-3">
                  <ShoppingCart className="h-5 w-5 text-eco-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Saldo Disponível</h3>
                  <p className="text-sm text-gray-500">R$ 2.500,00</p>
                </div>
              </div>
              <input type="radio" name="payment" defaultChecked className="h-4 w-4 text-eco-green-600" />
            </div>
            
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
          onClick={handleBuy}
          className="w-full bg-eco-green-600 hover:bg-eco-green-700 py-6"
          disabled={!amount || parseFloat(amount) <= 0 || selectedProject === null}
        >
          Finalizar Compra
        </Button>
      </div>
    </Layout>
  );
};

export default BuyCredits;
