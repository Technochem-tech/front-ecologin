import api from "./api";
import { tratarErroAPI } from "@/utils/tratarErroAPI";

interface VendaRequest {
  quantidadeCreditos: number;
}

export async function venderCreditos(token: string, dados: VendaRequest): Promise<string> {
  try {
    const response = await api.post<string>("/api/VendaCredito/vender", dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Exemplo: "Venda realizada com sucesso. Você recebeu R$ 2,50."
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
