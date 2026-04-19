import { useParams, Link } from 'react-router-dom';
import { useArticles } from '../hooks/useArticles';
import { useRubriques } from '../hooks/useRubriques';
import ArticleCard from '../components/article/ArticleCard';
import ArticleSkeleton from '../components/article/ArticleSkeleton';

const RubriquePage = () => {
  const { slug }            = useParams();
  const { data: rubriques } = useRubriques();

  // Trouve la rubrique par slug
  const rubrique = rubriques?.find(r =>
    r.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-') === slug
  );

  const { data: mainData, isLoading } = useArticles({
    limit:      20,
    statut:     'publie',
    rubriqueId: rubrique?.id || undefined,
  });

  const articles = mainData?.articles || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">

      {/* ─── Header ─── */}
      <div className="mb-8 pb-6 border-b-4 border-primary-600">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-xs text-gray-400 hover:text-primary-600 transition-colors">
            Accueil
          </Link>
          <span className="text-gray-300 dark:text-gray-600">›</span>
          <span className="text-xs text-primary-600 font-semibold">
            {rubrique?.nom ?? slug}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
          {rubrique?.nom ?? slug}
        </h1>
        {rubrique?.description && (
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            {rubrique.description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {mainData?.pagination?.total ?? 0} article(s)
        </p>
      </div>

      {/* ─── Contenu ─── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 dark:text-gray-400">Aucun article dans cette rubrique.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ─── Colonne principale ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {articles[0] && <ArticleCard article={articles[0]} hero />}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {articles.slice(1, 5).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
            {articles.slice(5).length > 0 && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plus d'articles
                </h3>
                {articles.slice(5).map((a) => <ArticleCard key={a.id} article={a} compact />)}
              </div>
            )}
          </div>

          {/* ─── Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">

              {/* Autres rubriques */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 uppercase tracking-wider">
                  Autres rubriques
                </h3>
                <div className="flex flex-col gap-2">
                  {rubriques?.filter(r => r.id !== rubrique?.id).map((r) => (
                    <Link
                      key={r.id}
                      to={`/rubrique/${r.nom.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 transition-colors">
                        {r.nom}
                      </span>
                      <span className="text-gray-300 text-xs">›</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Les plus lus */}
              {articles.length > 1 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                  <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 uppercase tracking-wider">
                    Les plus lus
                  </h3>
                  <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                    {[...articles]
                      .sort((a, b) => b.nombreVues - a.nombreVues)
                      .slice(0, 4)
                      .map((a, i) => (
                        <Link key={a.id} to={`/articles/${a.id}`}
                          className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                        >
                          <div className="relative shrink-0">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {a.imagePrincipale ? (
                                <img src={a.imagePrincipale} alt={a.titre}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-lg">📰</div>
                              )}
                            </div>
                            <span className="absolute -top-2 -left-2 h-5 w-5 rounded-full bg-primary-600 text-white text-xs font-black flex items-center justify-center shadow">
                              {i + 1}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug group-hover:text-primary-600 transition-colors">
                              {a.titre}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">{a.nombreVues} vues</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RubriquePage;