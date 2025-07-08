import api from "./api";
import { tratarErroAPI } from "@/utils/tratarErroAPI";

export interface Transacao {
  dataHora: string;
  descricao: string;
  quantidade: number;
  status: string;
  tipo: string;
  CopiaColaPix: string;
}

interface RespostaHistorico {
  historicodetransacao: Transacao[];
}

interface FiltroHistorico {
  dataInicio?: string; // formato ISO 8601, ex: "2025-07-01T00:00:00"
  dataFim?: string;    // formato ISO 8601, ex: "2025-07-03T23:59:59"
  tipo?: string;       // "compra", "venda", "transferência_entrada", etc.
}

export async function ReceberHistoricoTransacao(token: string, filtro?: FiltroHistorico): Promise<Transacao[]> {
  try {
    const response = await api.get<RespostaHistorico>(
      "/api/HistoricoTransacao/ConsultarHistorico",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: filtro
      }
    );
    return response.data.historicodetransacao;
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
