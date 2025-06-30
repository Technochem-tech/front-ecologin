import api from "./api";
import { tratarErroAPI } from "@/utils/tratarErroAPI";

interface CompraRequest {
  valorReais: number;
  idProjeto: number;
}

interface CompraResponse {
  qrCode: string;
  pagamentoId: string;
}

export async function iniciarCompra(token: string, dados: CompraRequest): Promise<CompraResponse> {
  try {
    const response = await api.post<CompraResponse>("/api/CompraCreditos/iniciar-compra", dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // retorna os dados para o componente usar
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
