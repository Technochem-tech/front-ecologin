import { ChevronRight, ShoppingCart, TrendingUp, Send } from "lucide-react";
import Layout from "@/components/Layout";
import BalanceCard from "@/components/BalanceCard";
import CarbonCreditsCard from "@/components/CarbonCreditsCard";
import ActionButton from "@/components/ActionButton";
import ProjectCard from "@/components/ProjectCard";
import { useNavigate } from "react-router-dom";

import React, { useEffect, useState } from "react";
import { getSaldo, getSaldoCreditos } from "@/services/getSaldo";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const buscarSaldo = async () => {
      try {
        const dados = await getSaldo(token);
        setSaldo(dados.saldoemconta);
      } catch (erro) {
        console.error("Erro ao buscar saldo:", erro);
      }
    };

    buscarSaldo();
  }, [navigate]);

  const [saldoCredito, setSaldoCredito] = useState<number | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const buscarSaldoCredito = async () => {
      try {
        const dados = await getSaldoCreditos(token);
        setSaldoCredito(dados.saldoemconta);
      } catch (erro) {
        console.error("Erro ao buscar saldo:", erro);
      }
    };
    buscarSaldoCredito();
  }, [navigate]);

  const handleActionClick = (action: string) => {
    console.log(`Action clicked: ${action}`);
    switch (action) {
      case "buy":
        navigate("/buy-credits");
        break;
      case "sell":
        navigate("/sell-credits");
        break;
      case "transfer":
        navigate("/transfer");
        break;
      default:
        break;
    }
  };

  // Sample projects data
  const projects = [
    {
      id: 1,
      title: "Reflorestamento Amazônia",
      description:
        "Projeto de recuperação de áreas degradadas na Amazônia Brasileira.",
      price: "R$ 45,00",
      image:
        "https://images.unsplash.com/photo-1586974710160-55f48f417990?q=80&w=2564&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Energia Solar Nordeste",
      description:
        "Implementação de painéis solares em comunidades rurais do nordeste.",
      price: "R$ 38,50",
      image:
        "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=2672&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Biodigestores Rurais",
      description:
        "Conversão de resíduos orgânicos em energia limpa para propriedades rurais.",
      price: "R$ 42,75",
      image:
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=2670&auto=format&fit=crop",
    },
  ];

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-20 page-transition">
        {/* Header */}
        <header className="mb-8 opacity-0 animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Olá,</p>
              <h1 className="text-2xl font-bold text-gray-900">João Silva</h1>
              <p className="text-sm text-eco-green-700">
                Seu impacto positivo continua!
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <BalanceCard
            amount={
              typeof saldo === "number"
                ? saldo.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                : "Carregando..."
            }
          />

          <CarbonCreditsCard
            amount={
              typeof saldoCredito === "number"
                ? saldoCredito.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "Carregando..."
            }
            unit="Toneladas CO₂"
          />
        </section>

        {/* Impact Graph - Simplified Version */}
        <section className="mb-8 opacity-0 animate-fade-in-delayed-3">
          <div className="glass-card rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-medium text-gray-900">
                Impacto Ambiental
              </h2>
              <span className="text-xs text-eco-green-600 bg-eco-green-100 px-2 py-1 rounded-full">
                +18% este ano
              </span>
            </div>
            <div className="h-32 w-full flex items-end space-x-2">
              {[35, 28, 45, 32, 55, 42, 60, 55, 65, 72, 68, 78].map(
                (height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-eco-green-500 to-eco-blue-400 rounded-t-sm opacity-80"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1">
                      {
                        [
                          "J",
                          "F",
                          "M",
                          "A",
                          "M",
                          "J",
                          "J",
                          "A",
                          "S",
                          "O",
                          "N",
                          "D",
                        ][i]
                      }
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-base font-medium text-gray-900 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <ActionButton
              icon={ShoppingCart}
              label="Comprar Créditos"
              onClick={() => handleActionClick("buy")}
              color="green"
            />
            <ActionButton
              icon={TrendingUp}
              label="Vender Créditos"
              onClick={() => handleActionClick("sell")}
              color="blue"
            />
            <ActionButton
              icon={Send}
              label="Transferir"
              onClick={() => handleActionClick("transfer")}
              color="green"
            />
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-gray-900">
              Projetos Sustentáveis
            </h2>
            <a
              href="#"
              className="text-sm text-eco-green-600 flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                description={project.description}
                price={project.price}
                image={project.image}
              />
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
