import { strict } from "assert";
import api from "./api";
import { tratarErroAPI } from "@/utils/handleApiError";
import { promise, string } from "zod";
import { error } from "console";

// 1. Solicitar redefinição
export async function solicitarRedefinicao(Email: string): Promise<void> {
  try {
    await api.post("/api/RedefinicaoSenha/solicitar", { Email });
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}

// 2. Validar token
export async function validarToken(token: string): Promise<boolean> {
  try {
    await api.post(`/api/RedefinicaoSenha/validar-token?token=${token}`);
    return true;
  } catch (error) {
    return false;
  }
}

// 3. Atualizar senha
export async function atualizarSenha(
  token: string,
  novaSenha: string
): Promise<void> {
  try {
    await api.post("/api/RedefinicaoSenha/atualizar-senha", {
      token,
      novaSenha,
    });
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
