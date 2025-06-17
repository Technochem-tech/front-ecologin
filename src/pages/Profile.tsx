
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Edit, CreditCard, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import CardForm from '@/components/CardForm';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    registrationCode: "ECO-73625"
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: "1",
      type: "Cartão de Crédito",
      info: "**** **** **** 3456",
      holder: "João Silva",
      expiry: "09/2025"
    },
    {
      id: "2",
      type: "Conta Bancária",
      info: "Banco 237 | Ag: 1234 | CC: 12345-6",
      holder: "João Silva",
      expiry: ""
    }
  ]);

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    toast.success("Método de pagamento removido com sucesso!");
  };

  const handleAddCard = (cardData: any) => {
    // Mask card number for display
    const lastFourDigits = cardData.cardNumber.replace(/\s/g, '').slice(-4);
    const maskedNumber = `**** **** **** ${lastFourDigits}`;
    
    const newMethod = {
      id: `${paymentMethods.length + 1}`,
      type: "Cartão de Crédito",
      info: maskedNumber,
      holder: cardData.cardHolder,
      expiry: cardData.expiryDate
    };
    
    setPaymentMethods([...paymentMethods, newMethod]);
    setIsCardDialogOpen(false);
    toast.success("Novo cartão adicionado com sucesso!");
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-20">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          <p className="text-sm text-gray-600">Gerencie suas informações pessoais e financeiras</p>
        </header>

        <Tabs defaultValue="personal" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full bg-eco-green-50 p-1 rounded-lg">
            <TabsTrigger value="personal" className="data-[state=active]:bg-white">Informações Pessoais</TabsTrigger>
            <TabsTrigger value="payment" className="data-[state=active]:bg-white">Métodos de Pagamento</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Informações Pessoais</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-eco-green-600 hover:text-eco-green-700"
                >
                  {isEditing ? 'Cancelar' : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-eco-green-100 flex items-center justify-center text-eco-green-600 text-xl font-semibold mr-4">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{userData.name}</h3>
                    <p className="text-sm text-gray-500">Membro desde Maio 2023</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Código de Cadastro</p>
                  <p className="text-gray-800 font-mono bg-eco-green-50 px-3 py-1 rounded inline-block">
                    {userData.registrationCode}
                  </p>
                </div>
                
                {isEditing ? (
                  // Formulário de edição
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input 
                        type="text" 
                        id="name"
                        value={userData.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Nome não pode ser alterado</p>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        id="email"
                        value={userData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email não pode ser alterado</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                      <input 
                        type="tel" 
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => setUserData({...userData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green-500 focus:border-eco-green-500"
                      />
                    </div>
                    
                    <Button 
                      onClick={handleSaveChanges}
                      className="w-full bg-eco-green-600 hover:bg-eco-green-700"
                    >
                      Salvar Alterações
                    </Button>
                  </div>
                ) : (
                  // Visualização de dados
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Nome</p>
                      <p className="text-gray-800">{userData.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-800">{userData.email}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-gray-800">{userData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="mt-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Métodos de Pagamento</h2>
                <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center text-eco-green-600 border-eco-green-500 hover:bg-eco-green-50"
                    >
                      <PlusCircle className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <CardForm onSubmit={handleAddCard} />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-eco-green-100 rounded-full flex items-center justify-center text-eco-green-600 mr-3">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{method.type}</p>
                        <p className="text-sm text-gray-500">{method.info}</p>
                        {method.expiry && (
                          <p className="text-xs text-gray-400">Validade: {method.expiry}</p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {paymentMethods.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    <p>Nenhum método de pagamento cadastrado</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
