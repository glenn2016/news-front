import { useParams, Link } from 'react-router-dom';
import { useArticle, useSimilaires } from '../hooks/useArticles';
import Spinner from '../components/ui/Spinner';
import ArticleCard from '../components/article/ArticleCard';
import ArticleSkeleton from '../components/article/ArticleSkeleton';

const formatDate = (date) =>
  new Date(date).toLocaleDateString('fr-FR', {
    day:     'numeric',
    month:   'long',
    year:    'numeric',
    hour:    '2-digit',
    minute:  '2-digit',
  });

const BADGES = {
  breaking_news: { label: '🔴 Breaking News', style: 'bg-red-600 text-white' },
  une:           { label: '⭐ À la une',       style: 'bg-yellow-500 text-white' },
  exclusif:      { label: '💎 Exclusif',       style: 'bg-purple-600 text-white' },
  trending:      { label: '🔥 Trending',       style: 'bg-orange-500 text-white' },
};

const Article = () => {
  const { id } = useParams();
  const { data: article,   isLoading,           isError }          = useArticle(id);
  const { data: similaires, isLoading: similairesLoading }         = useSimilaires(id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-6xl">😕</p>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Article introuvable
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Cet article n'existe pas ou a été supprimé.
        </p>
        <Link to="/" className="mt-2 text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm">
          ← Retour à l'accueil
        </Link>
      </div>
    );
  }

  const badge = article.badge ? BADGES[article.badge] : null;

return (
    <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

        {/* ─── Contenu principal ─── */}
        <div className="flex-1 min-w-0">

          {/* ─── Breadcrumb ─── */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-6 md:mb-8 flex-wrap">
            <Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Accueil
            </Link>
            <span>/</span>
            {article.rubrique && (
              <>
                <Link to={`/?rubrique=${article.rubrique.id}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {article.rubrique.nom}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="truncate text-gray-400 max-w-[150px] md:max-w-xs">
              {article.titre}
            </span>
          </div>

          {/* ─── Header ─── */}
          <div className="mb-6 md:mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3 md:mb-4">
              {article.rubrique && (
                <span className="inline-block bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {article.rubrique.nom}
                </span>
              )}
              {badge && (
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${badge.style}`}>
                  {badge.label}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              {article.titre}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 md:h-7 md:w-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400 shrink-0">
                  {article.redacteur?.nom?.charAt(0).toUpperCase()}
                </div>
                <span>{article.redacteur?.nom}</span>
              </div>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{formatDate(article.datePublication || article.created_at)}</span>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span>{article.nombreVues} vues</span>
            </div>
          </div>

          {/* ─── Image ─── */}
          {article.imagePrincipale && (
            <div className="mb-6 md:mb-8 rounded-xl overflow-hidden">
              <img
                src={article.imagePrincipale}
                alt={article.titre}
                className="w-full h-52 sm:h-64 md:h-72 lg:h-96 object-cover"
              />
            </div>
          )}

          {/* ─── Contenu ─── */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {article.contenu.split('\n').map((paragraph, i) => (
              paragraph.trim() && (
                <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
                  {paragraph}
                </p>
              )
            ))}
          </div>

          {/* ─── Partage ─── */}
          <div className="mt-8 md:mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Partager cet article :
            </p>
            <div className="flex items-center gap-3">
             <a 
                href={`https://x.com/intent/tweet?text=${encodeURIComponent(article.titre)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Lien copié !'); }}
                className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* ─── Retour ─── */}
          <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline font-medium text-sm md:text-base">
              ← Retour à l'accueil
            </Link>
          </div>

        </div>

        {/* ─── Sidebar similaires ─── */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-24">

            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-black text-gray-900 dark:text-white border-l-4 border-primary-600 pl-3">
                Articles similaires
              </h2>
            </div>

            <div className="flex flex-col gap-4">
              {similairesLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse">
                    <div className="w-20 h-20 shrink-0 rounded-lg bg-gray-200 dark:bg-gray-700" />
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : similaires?.length > 0 ? (
                similaires.map((a) => (
                  <Link
                    key={a.id}
                    to={`/articles/${a.id}`}
                    className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-gray-100 dark:border-gray-800"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                      {a.imagePrincipale ? (
                        <img
                          src={a.imagePrincipale}
                          alt={a.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">📰</div>
                      )}
                    </div>

                    {/* Contenu */}
                    <div className="flex flex-col gap-1 min-w-0 flex-1">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(a.datePublication || a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                      </p>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {a.titre}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-auto">
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{a.nombreVues ?? 0}</span>
                      </div>
                    </div>
                  </Link>
                ))
              ) : null}
            </div>

          </div>
        </aside>

      </div>
    </main>
  );
};


export default Article;