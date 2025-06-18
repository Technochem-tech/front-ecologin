import axios from "axios";
import api from "./api";

export async function getSaldo(token: string) {
  const resposta = await api.get("/api/Saldo/GetSaldo-dinheiro", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}

export async function getSaldoCreditos(token: string) {
  const resposta = await api.get("/api/Saldo/GetSaldo-Creditos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}
