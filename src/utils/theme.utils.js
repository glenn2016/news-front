// Détecte si c'est le soir (après 18h ou avant 6h) → dark mode auto
export const shouldBeDark = () => {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
};

// Récupère le thème sauvegardé ou auto selon l'heure
export const getInitialTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return shouldBeDark() ? 'dark' : 'light';
};