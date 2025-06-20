import { toast } from "sonner";

export function tratarErroAPI(error: any) {
  if (error.response?.status === 401) {
    toast.error("Sessão expirada. Faça login novamente.", {
      description: "Redirecionando em 3 segundos...",
      duration: 3000,
    });

    localStorage.removeItem("token");

    setTimeout(() => {
      window.location.href = "/";
    }, 3000); // espera 3 segundos antes de redirecionar
  } else {
    console.error("Erro na API:", error);
  }
}
