import api from './api';

// Interface dos dados enviados para login
interface DadosLogin {
  email: string;
  senha: string;
}

// Interface dos dados recebidos após login
interface RespostaLogin {
  token: string;
}

// Função para autenticação
export async function login(dados: DadosLogin): Promise<RespostaLogin> {
  const resposta = await api.post('/api/Autenticacao/login', dados);
  return resposta.data;
}
