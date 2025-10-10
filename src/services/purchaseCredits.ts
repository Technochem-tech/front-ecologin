import api from "./api";
import { tratarErroAPI } from "@/utils/handleApiError";

interface CompraRequest {
  valorReais: number;
  idProjeto: number;
}

interface CompraResponse {
  qrCode: string;
  pagamentoId: string;
}

export async function iniciarCompra(
  token: string,
  dados: CompraRequest
): Promise<CompraResponse> {
  try {
    const response = await api.post<CompraResponse>(
      "/api/CompraCreditos/iniciar-compra",
      dados,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // retorna os dados para o componente usar
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}

interface StatusPagamentoResponse {
  idPagamento: string;
  status: string; // "pending", "approved", "failed", etc.
}

export async function verificarStatusPagamento(
  token: string,
  idPagamento: string
): Promise<StatusPagamentoResponse> {
  try {
    const response = await api.get<StatusPagamentoResponse>(
      `/api/Pagamento/status/${idPagamento}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
