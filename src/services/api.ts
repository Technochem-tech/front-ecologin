// Importa o Axios, uma biblioteca para fazer requisições HTTP
import axios from 'axios';

// Cria uma instância personalizada do Axios chamada "api"
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Exporta essa instância para ser usada em outros arquivos do projeto
export default api;
