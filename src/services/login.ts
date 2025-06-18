import { promises } from 'dns';
import api from './api'

// Interface que define os dados que vai enviar para o login
interface DadosLogin{
    email: string;
    senha: string; 
}

// Interface que define o que a API vai retornar depois do login
interface RespostaLogin {
  token: string;     
}

// Função que faz a requisição para a API de login
export async function login(dados: DadosLogin): Promise<RespostaLogin> {
  // Faz a requisição POST para o endpoint /login
  const resposta = await api.post('/api/Autenticacao/login', dados)

  // Retorna os dados que o back enviou
  return resposta.data;
}