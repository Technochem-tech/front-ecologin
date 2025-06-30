import api from "./api";
import { tratarErroAPI } from "@/utils/tratarErroAPI"; 

export type UsuarioResposta = {
  id: number;
  nome: string;
  email: string;
  empresa: string;
  cnpj: string;
  telefone: string;
  dataCadastro : string;
};

// Buscar usuário logado
export async function usuario(token: string): Promise<UsuarioResposta> {
  try {
    const resposta = await api.get("/api/Usuario/ConsultarUsuario", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return resposta.data;
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}

// Atualizar telefone
export async function atualizarTelefone(token: string, telefone: string): Promise<void> {
  try {
    await api.put(
      "/api/Usuario/EditarTelefone",
      { telefone },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}

// Buscar imagem do usuário (retorna URL temporária)

export async function buscarImagemUsuario(token: string): Promise<string> {
  try {
    const resposta = await api.get("/api/Usuario/Buscar-imagem", {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob", // necessário para tratar imagem binária
    });

    const urlImagem = URL.createObjectURL(resposta.data);
    return urlImagem;
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
// Atualizar ou Adicionar foto de usuario.
export async function AddOuAtualizarImgUsuario(token: string, imagem: File): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("imagem", imagem); 

    await api.put("/api/Usuario/SalvarOuAtualizarImagem", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}
// cadastrar usuario
export type UsuarioCadastro = {
  nome: string;
  email: string;
  senha: string;
  empresa: string;
  cnpj: string;
  telefone: string;
};

export async function cadastrarUsuario(dados: UsuarioCadastro): Promise<void> {
  try {
    await api.post("/api/Usuario/Cadastrar", dados);
  } catch (error) {
    tratarErroAPI(error);
    throw error;
  }
}

