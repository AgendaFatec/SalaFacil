import { useState, useEffect } from "react";

const PESQUISA_VISUALIZADA_KEY = "pesquisaVisualizada";

export function usePesquisaBadge() {
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Verifica ao carregar se a pesquisa já foi visualizada
    const foiVisualizada =
      localStorage.getItem(PESQUISA_VISUALIZADA_KEY) === "true";
    setShowBadge(!foiVisualizada);
  }, []);

  const marcarComoVisualizada = () => {
    localStorage.setItem(PESQUISA_VISUALIZADA_KEY, "true");
    setShowBadge(false);
  };

  const resetarBadge = () => {
    localStorage.removeItem(PESQUISA_VISUALIZADA_KEY);
    setShowBadge(true);
  };

  return {
    showBadge,
    marcarComoVisualizada,
    resetarBadge,
  };
}
