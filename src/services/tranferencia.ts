import api from "./api"; 
import { tratarErroAPI } from "@/utils/tratarErroAPI";


interface RespostaApi {
  id: number;
  nome: string;
  email: string;
  cnpj: string;
}


export async function VerificarDestinatario(token: string, emailOuCnpj: string): Promise<RespostaApi> {
  try {
    const response = await api.get<RespostaApi>(
      "/api/TransferirCredito/verificar-destinatario",
      {
        params: { emailOuCnpj },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    tratarErroAPI(error);
    throw error; // para o chamador tratar se quiser
  }
}

interface ConfirmarTransferenciaPayload {
  destinatarioEmailOuCnpj: string;
  quantidadeCredito: number;
  descricao: string;
}

export async function ConfirmarTransferenciaCredito(token: string, payload: ConfirmarTransferenciaPayload): Promise<void> {
  try {
    await api.post(
      "/api/TransferirCredito/confirmarTransferenciaCredito",
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
