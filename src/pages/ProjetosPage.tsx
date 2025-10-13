import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import ProjectCard from "@/components/ProjectCard";
import { useNavigate } from "react-router-dom";
import { ListarProjetos } from "@/services/projects";
import { ArrowLeft, Loader2 } from "lucide-react"; // 👈 ícones

interface Projeto {
  id: number;
  titulo: string;
  valor: number;
  descricao: string;
  imgBase64: string;
  creditosDisponivel: number;
}

const ProjetosPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Projeto[]>([]);
  const [loading, setLoading] = useState(true); // 👈 estado de loading

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
        console.error("Erro ao carregar projetos:", error);
      } finally {
        setLoading(false); // 👈 encerra o loading mesmo em caso de erro
      }
    };

    buscarProjetos();
  }, [navigate]);

  return (
    <Layout showNavbar>
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 page-transition">
        {/* 🔙 Botão de voltar */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-eco-green-700 hover:text-eco-green-900 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Voltar
        </button>

        <h1 className="text-xl font-semibold mb-6 text-gray-800">
          Todos os Projetos Sustentáveis
        </h1>

        {/* ⏳ Se estiver carregando */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-pulse">
            <Loader2 className="h-8 w-8 mb-3 animate-spin text-eco-green-600" />
            <p>Carregando projetos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id} 
                  title={project.titulo}
                  description={project.descricao}
                  price={`SCB ${project.valor.toFixed(2)}`}
                  image={`data:image/jpeg;base64,${project.imgBase64}`}
                  onClick={() => navigate(`/projetos/${project.id}`)}
                  showMoreButton
                />
              ))
            ) : (
              <p className="text-center text-gray-500">
                Nenhum projeto encontrado.
              </p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjetosPage;
