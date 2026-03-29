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

const ArticleCard = ({ article, hero = false, compact = false }) => {
  const badge = article.badge ? BADGES[article.badge] : null;

  // ─── Mode COMPACT ──────────────────────────────────────────
  if (compact) {
    return (
      <Link
        to={`/articles/${article.id}`}
        className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800 h-24"
      >
        {/* Image fixe */}
        <div className="relative w-20 h-full shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          {article.imagePrincipale ? (
            <img
              src={article.imagePrincipale}
              alt={article.titre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex flex-col gap-1 min-w-0 flex-1 overflow-hidden">
          {badge && (
            <span className={`self-start text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${badge.style}`}>
              {badge.label}
            </span>
          )}
          <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {article.titre}
          </h3>
          <p className="text-xs text-gray-400 mt-auto shrink-0">
            {formatDate(article.datePublication || article.created_at)}
          </p>
        </div>
      </Link>
    );
  }

  // ─── Mode HERO ─────────────────────────────────────────────
  if (hero) {
    return (
      <Link
        to={`/articles/${article.id}`}
        className="group relative block rounded-2xl overflow-hidden h-80 md:h-full min-h-[320px] md:min-h-[360px]"
      >
        <div className="absolute inset-0">
          {article.imagePrincipale ? (
            <img
              src={article.imagePrincipale}
              alt={article.titre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-950 flex items-center justify-center text-8xl">
              📰
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
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
          <h2 className="text-lg md:text-2xl font-black text-white leading-tight line-clamp-3 group-hover:text-primary-300 transition-colors mb-2">
            {article.titre}
          </h2>
          <div className="flex items-center gap-3 text-gray-300 text-xs">
            <span>{article.redacteur?.nom}</span>
            <span>•</span>
            <span>{formatDate(article.datePublication || article.created_at)}</span>
          </div>
        </div>
      </Link>
    );
  }

  // ─── Mode NORMAL ───────────────────────────────────────────
  return (
    <Link
      to={`/articles/${article.id}`}
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 flex flex-col h-full"
    >
      {/* Image — hauteur fixe */}
      <div className="relative h-44 overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
        {article.imagePrincipale ? (
          <img
            src={article.imagePrincipale}
            alt={article.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📰</div>
        )}
        {article.rubrique && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            {article.rubrique.nom}
          </span>
        )}
        {badge && (
          <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${badge.style}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Contenu — flex-1 pour remplir l'espace */}
      <div className="p-4 flex flex-col gap-2 flex-1">

        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
          {formatDate(article.datePublication || article.created_at)}
        </p>

        {/* Titre — max 2 lignes */}
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 shrink-0">
          {article.titre}
        </h2>

        {/* Contenu — max 3 lignes, flex-1 pour pousser le footer en bas */}
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed flex-1">
          {article.contenu}
        </p>

        {/* Footer card — toujours en bas */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 shrink-0 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
              {article.redacteur?.nom?.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {article.redacteur?.nom}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 shrink-0">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{article.nombreVues ?? 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;