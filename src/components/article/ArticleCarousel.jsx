import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

const BADGES = {
  breaking_news: { label: '🔴 Breaking News', style: 'bg-red-600 text-white' },
  une:           { label: '⭐ À la une',       style: 'bg-yellow-500 text-white' },
  exclusif:      { label: '💎 Exclusif',       style: 'bg-purple-600 text-white' },
  trending:      { label: '🔥 Trending',       style: 'bg-orange-500 text-white' },
};

const ArticleCarousel = ({ articles = [] }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % articles.length), [articles.length]);

  const prev = () =>
    setCurrent((c) => (c - 1 + articles.length) % articles.length);

  // Auto-slide toutes les 5s
  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, articles.length]);

  if (!articles.length) return null;

  const article = articles[current];
  const badge   = article.badge ? BADGES[article.badge] : null;

  return (
    <div className="relative w-full h-[480px] md:h-[560px] overflow-hidden rounded-2xl group">

      {/* ─── Image background ─── */}
      <div className="absolute inset-0">
        {article.imagePrincipale ? (
          <img
            src={article.imagePrincipale}
            alt={article.titre}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center text-8xl">
            📰
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      </div>

      {/* ─── Contenu ─── */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

        {/* Badges */}
        <div className="flex items-center gap-2 mb-3">
          {article.rubrique && (
            <span className="bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {article.rubrique.nom}
            </span>
          )}
          {badge && (
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.style}`}>
              {badge.label}
            </span>
          )}
        </div>

        {/* Titre */}
        <Link to={`/articles/${article.id}`}>
          <h2 className="text-2xl md:text-4xl font-black text-white leading-tight hover:text-primary-300 transition-colors mb-3 line-clamp-3">
            {article.titre}
          </h2>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-4 text-gray-300 text-sm">
          <span>{article.redacteur?.nom}</span>
          <span>•</span>
          <span>{formatDate(article.datePublication || article.created_at)}</span>
          <span>•</span>
          <span>👁 {article.nombreVues} vues</span>
        </div>
      </div>

      {/* ─── Contrôles ─── */}
      {articles.length > 1 && (
        <>
          {/* Boutons prev/next */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-6 flex items-center gap-1.5">
            {articles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all ${
                  i === current
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleCarousel;