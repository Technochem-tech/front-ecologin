import { tratarErroAPI } from "@/utils/tratarErroAPI";
import api from "./api";

interface Projeto {
  id: number;
  titulo: string;
  valor: number;
  descricao: string;
  imgBase64: string;
  creditosDisponivel: number;

}

export async function ListarProjetos(token: string): Promise<Projeto[]> {
  try {
    const response = await api.get("/api/Projetos/ListarProjetos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // Retorna apenas o array de projetos
    return response.data.projetossustentaveis;
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
