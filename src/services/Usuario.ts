import api from "./api";

// Tipo da resposta que vem da API
export type UsuarioResposta = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  cnpj: string;
  telefone: string;
};

// Função que recebe o token e retorna os dados do usuário
export async function usuario(token: string): Promise<UsuarioResposta> {
  const resposta = await api.get("api/Usuario/ConsultarUsuario", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return resposta.data;
}
