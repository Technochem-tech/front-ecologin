// Importa o Axios, uma biblioteca para fazer requisições HTTP
import axios from 'axios';

// Cria uma instância personalizada do Axios chamada "api"
// A baseURL define o endereço base de todas as requisições (ex: http://localhost:7255/api)
// Esse valor vem de uma variável de ambiente (.env)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Exporta essa instância para ser usada em outros arquivos do projeto
export default api;
