import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Edit, Trash2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CardForm from "@/components/CardForm";
import FooterNav from "@/components/FooterNav"; // Importa rodapé fixo

import {
  UsuarioResposta,
  usuario,
  atualizarTelefone,
  buscarImagemUsuario,
  AddOuAtualizarImgUsuario,
} from "@/services/Usuario";

type PaymentMethod = {
  id: string;
  type: string;
  info: string;
  holder: string;
  expiry: string;
};

type CardData = {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioResposta | null>(
    null
  );
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [imagemSelecionada, setImagemSelecionada] = useState<File | null>(null);
  const [telefoneOriginal, setTelefoneOriginal] = useState<string>("");

  const [userData, setUserData] = useState({
    name: "carregando...",
    email: "carregando...",
    phone: "carregando...",
    registrationCode: "carregando...",
    dataRegistro: "",
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  function formatarMesAno(data: string) {
    const d = new Date(data);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  }

  const formatarTelefone = (telefone: string): string => {
    const raw = telefone.replace(/\D/g, "");
    return raw
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const dados = await usuario(token);
        setUsuarioLogado(dados);
        setTelefoneOriginal(dados.telefone);

        const imagemBase64 = await buscarImagemUsuario(token);
        setFotoPerfil(imagemBase64);
      } catch (error) {
        console.warn("Não foi possível carregar os dados.");
      }
    }
    carregarUsuario();
  }, []);

  useEffect(() => {
    if (usuarioLogado) {
      const codigoFormatado = `ECO-010${String(usuarioLogado.id).padStart(
        6,
        "0"
      )}`;
      setUserData({
        name: usuarioLogado.nome,
        email: usuarioLogado.email,
        phone: formatarTelefone(usuarioLogado.telefone),
        registrationCode: codigoFormatado,
        dataRegistro: usuarioLogado.dataCadastro,
      });
    }
  }, [usuarioLogado]);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Usuário não autenticado.");
      return;
    }

    const rawPhone = userData.phone.replace(/\D/g, "");
    const telefoneFoiAlterado = rawPhone !== telefoneOriginal;

    try {
      // Atualiza telefone se estiver editando e houve alteração
      if (isEditing && telefoneFoiAlterado) {
        if (rawPhone.length !== 11) {
          toast.error("Número de telefone inválido.");
          return;
        }
        await atualizarTelefone(token, rawPhone);
      }

      // Atualiza imagem se nova foi selecionada
      if (imagemSelecionada) {
        await AddOuAtualizarImgUsuario(token, imagemSelecionada);
        const novaImagem = await buscarImagemUsuario(token);
        setFotoPerfil(novaImagem);
      }

      setIsEditing(false);
      toast.success("Dados atualizados com sucesso!");
    } catch (error: any) {
      const mensagem =
        error?.response?.data?.mensagem || "Erro ao salvar alterações.";
      toast.error(mensagem);
    }
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
    toast.success("Método de pagamento removido com sucesso!");
  };

  const handleAddCard = (cardData: CardData) => {
    const lastFourDigits = cardData.cardNumber.replace(/\s/g, "").slice(-4);
    const maskedNumber = `**** **** **** ${lastFourDigits}`;

    const newMethod: PaymentMethod = {
      id: `${paymentMethods.length + 1}`,
      type: "Cartão de Crédito",
      info: maskedNumber,
      holder: cardData.cardHolder,
      expiry: cardData.expiryDate,
    };

    setPaymentMethods([...paymentMethods, newMethod]);
    setIsCardDialogOpen(false);
    toast.success("Novo cartão adicionado com sucesso!");
  };

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-28">
        {" "}
        {/* padding maior para FooterNav */}
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Perfil</h1>
          </div>
          <p className="text-sm text-gray-600">
            Gerencie suas informações pessoais e financeiras
          </p>
        </header>
        <Tabs defaultValue="personal" className="mb-8">
          <TabsList className="grid grid-cols-2 w-full bg-eco-green-50 p-1 rounded-lg">
            <TabsTrigger
              value="personal"
              className="data-[state=active]:bg-white"
            >
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-white"
            >
              Métodos de Pagamento
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-6">
            <div className="glass-card p-5 rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Informações Pessoais
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center text-eco-green-600 hover:text-eco-green-700"
                >
                  {isEditing ? (
                    "Cancelar"
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full overflow-hidden bg-eco-green-100 flex items-center justify-center text-eco-green-600 text-xl font-semibold mr-4">
                    {fotoPerfil ? (
                      <img
                        src={fotoPerfil}
                        alt="Foto do perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {userData.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Membro desde {formatarMesAno(userData.dataRegistro)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Código de Cadastro
                  </p>
                  <p className="text-gray-800 font-mono bg-eco-green-50 px-3 py-1 rounded inline-block">
                    {userData.registrationCode}
                  </p>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={userData.name}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={userData.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Telefone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={userData.phone}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatado = raw
                            .replace(/^(\d{2})(\d)/, "($1) $2")
                            .replace(/(\d{5})(\d)/, "$1-$2")
                            .slice(0, 15);
                          setUserData({ ...userData, phone: formatado });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-eco-green-500 focus:border-eco-green-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="imagem"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Foto de Perfil
                      </label>
                      <input
                        type="file"
                        id="imagem"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImagemSelecionada(file);
                            const urlPreview = URL.createObjectURL(file);
                            setFotoPerfil(urlPreview);
                          }
                        }}
                        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-eco-green-100 file:text-eco-green-700 hover:file:bg-eco-green-200"
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
                      <p className="text-sm font-medium text-gray-500">
                        Telefone
                      </p>
                      <p className="text-gray-800">{userData.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <div className="glass-card p-5 rounded-xl space-y-4">
              <p className="text-gray-500">
                No momento, o único método de pagamento disponível é{" "}
                <strong>PIX</strong>.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FooterNav /> {/* Rodapé fixo */}
    </Layout>
  );
};

export default Profile;
