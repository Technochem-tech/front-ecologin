import { ChevronRight, ShoppingCart, TrendingUp, Send } from "lucide-react";
import Layout from "@/components/Layout";
import BalanceCard from "@/components/BalanceCard";
import CarbonCreditsCard from "@/components/CarbonCreditsCard";
import ActionButton from "@/components/ActionButton";
import ProjectCard from "@/components/ProjectCard";
import FooterNav from "@/components/FooterNav";

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getSaldo, getSaldoCreditos } from "@/services/getBalance";
import { usuario, UsuarioResposta } from "@/services/users";
import { ListarProjetos } from "@/services/projects";

interface Projeto {
  id: number;
  titulo: string;
  valor: number;
  descricao: string;
  imgBase64: string;
  creditosDisponivel: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [saldo, setSaldo] = useState<number | null>(null);
  const [saldoCredito, setSaldoCredito] = useState<number | null>(null);
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioResposta | null>(
    null
  );
  const [projects, setProjects] = useState<Projeto[]>([]);

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

  useEffect(() => {
    async function carregarUsuario() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const dados = await usuario(token);
      setUsuarioLogado(dados);
    }

    carregarUsuario();
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const buscarProjetos = async () => {
      try {
        const dados = await ListarProjetos(token);
        setProjects(dados);
      } catch (error) {
        console.error("Erro ao buscar projetos:", error);
      }
    };

    buscarProjetos();
  }, [navigate]);

  const handleActionClick = (action: string) => {
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

  return (
    <Layout showNavbar>
      <div className="min-h-screen pt-6 pb-24 page-transition">
        <header
          className={`mb-8 transition-opacity duration-700 ${
            usuarioLogado ? "opacity-100 animate-fade-in" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm text-eco-green-700">
              Seu impacto positivo continua!
            </p>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <BalanceCard
            amount={
              typeof saldo === "number"
                ? saldo.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "SCB",
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

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-medium text-gray-900">
              Projetos Sustentáveis
            </h2>
            <button
              onClick={() => navigate("/buy-credits")}
              className="text-sm text-eco-green-600 flex items-center"
            >
              Ver todos <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.titulo}
                description={project.descricao}
                price={`SCB ${project.valor.toFixed(2)}`}
                image={`data:image/jpeg;base64,${project.imgBase64}`}
              />
            ))}
          </div>
        </section>
      </div>

      <FooterNav />
    </Layout>
  );
};

export default Dashboard;
