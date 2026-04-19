import { useSearchParams, Link } from 'react-router-dom';
import { useArticles, useSearch } from '../hooks/useArticles';
import { useRubriques, useRubriquesWithArticles } from '../hooks/useRubriques';
import ArticleCarousel from '../components/article/ArticleCarousel';
import ArticleCard from '../components/article/ArticleCard';
import ArticleSkeleton from '../components/article/ArticleSkeleton';

const Home = () => {
  const [searchParams] = useSearchParams();
  const rubriqueId     = searchParams.get('rubrique');
  const search         = searchParams.get('search');

  // ─── Carousel ─────────────────────────────────────────────
  const { data: breakingData } = useArticles({ badge: 'breaking_news', limit: 5, statut: 'publie' });
  const { data: uneData }      = useArticles({ badge: 'une',           limit: 5, statut: 'publie' });

  const carouselArticles = [
    ...(breakingData?.articles || []),
    ...(uneData?.articles      || []),
  ].filter((a, i, arr) => arr.findIndex(x => x.id === a.id) === i).slice(0, 6);

  const carouselIds = new Set(carouselArticles.map(a => a.id));

  // ─── Articles principaux ───────────────────────────────────
  const { data: mainData, isLoading: mainLoading } = useArticles({
    limit:      20,
    statut:     'publie',
    rubriqueId: rubriqueId || undefined,
    search:     search     || undefined,
  });

  const mainArticles = (mainData?.articles || [])
    .filter(a => !carouselIds.has(a.id))
    .slice(0, 7);

  // ─── Most Viewed ──────────────────────────────────────────
  const { data: mostViewedData } = useArticles({ limit: 10, statut: 'publie' });
  const mostViewed = (mostViewedData?.articles || [])
    .filter(a => !carouselIds.has(a.id))
    .sort((a, b) => b.nombreVues - a.nombreVues)
    .slice(0, 5);

  // ─── Rubriques avec articles ───────────────────────────────
  const { data: rubriques }             = useRubriques();
  const { data: rubriquesWithArticles } = useRubriquesWithArticles(3);

  const rubriquesFiltered = (rubriquesWithArticles || []).map(r => ({
    ...r,
    articles: r.articles.filter(a => !carouselIds.has(a.id)),
  })).filter(r => r.articles.length > 0);

  // ─── Meilisearch ──────────────────────────────────────────
  const { data: searchData, isLoading: searchLoading } = useSearch(
    search || '',
    { page: 1, limit: 10 }
  );

  // ─── Page recherche ───────────────────────────────────────
  if (search) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
              Résultats pour : <span className="text-primary-600">"{search}"</span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {searchData?.pagination?.total ?? 0} article(s) trouvé(s)
            </p>
          </div>
          {searchLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
          ) : (searchData?.articles || []).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-gray-500 dark:text-gray-400">Aucun article trouvé pour "{search}"</p>
              <p className="text-sm text-gray-400 mt-2">Essayez avec d'autres mots-clés</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(searchData?.articles || []).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ─── Page rubrique filtrée ────────────────────────────────
 // ─── Page rubrique filtrée ────────────────────────────────
if (rubriqueId) {
  const rubrique = rubriques?.find(r => r.id === rubriqueId);
  const articles = mainData?.articles || [];

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">

      {/* ─── Header rubrique ─── */}
      <div className="mb-8 pb-6 border-b-4 border-primary-600">
        <div className="flex items-center gap-3 mb-1">
          <Link to="/" className="text-xs text-gray-400 hover:text-primary-600 transition-colors">
            Accueil
          </Link>
          <span className="text-gray-300 dark:text-gray-600">›</span>
          <span className="text-xs text-primary-600 font-semibold">
            {rubrique?.nom ?? 'Rubrique'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mt-2">
          {rubrique?.nom ?? 'Articles'}
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
      {mainLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-gray-500 dark:text-gray-400">
            Aucun article dans cette rubrique.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ─── Colonne principale ─── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* 1er article hero */}
            {articles[0] && (
              <ArticleCard article={articles[0]} hero />
            )}

            {/* Grille articles suivants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {articles.slice(1, 5).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>

            {/* Articles compacts restants */}
            {articles.slice(5).length > 0 && (
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-black text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Plus d'articles
                </h3>
                {articles.slice(5).map((a) => (
                  <ArticleCard key={a.id} article={a} compact />
                ))}
              </div>
            )}

          </div>

          {/* ─── Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 flex flex-col gap-6">

              {/* Autres rubriques */}
              {/* <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
                <h3 className="text-sm font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800 uppercase tracking-wider">
                  Autres rubriques
                </h3>
                <div className="flex flex-col gap-2">
                  {rubriques?.filter(r => r.id !== rubriqueId).map((r) => (
                    <Link
                      key={r.id}
                      to={`/?rubrique=${r.id}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {r.nom}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600 text-xs">›</span>
                    </Link>
                  ))}
                </div>
              </div> */}

              {/* Most viewed dans cette rubrique */}
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
                        <Link
                          key={a.id}
                          to={`/articles/${a.id}`}
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
}

  // ─── Page accueil ─────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col gap-8 md:gap-10">

        {/* ─── Carousel + Most Viewed ─── */}
        {carouselArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
                À la une
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              {/* ─── Carousel gauche (2/3) ─── */}
              <div className="lg:col-span-2">
                <ArticleCarousel articles={carouselArticles} />
              </div>

            {/* ─── Most Viewed droite (1/3) ─── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 h-full">
                <h3 className="text-base font-black text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                  Most viewed
                </h3>
                <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                  {mostViewed.map((a, i) => (
                    <Link
                      key={a.id}
                      to={`/articles/${a.id}`}
                      className="group flex items-start gap-3 py-4 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity"
                    >
                      {/* ─── Numéro + Image ─── */}
                      <div className="relative shrink-0">
                        <div className="w-20 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {a.imagePrincipale ? (
                            <img
                              src={a.imagePrincipale}
                              alt={a.titre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl">📰</div>
                          )}
                        </div>
                        {/* Numéro en overlay */}
                        <span className="absolute -top-2 -left-2 h-6 w-6 rounded-full bg-primary-600 text-white text-xs font-black flex items-center justify-center shadow">
                          {i + 1}
                        </span>
                      </div>

                      {/* ─── Contenu ─── */}
                      <div className="flex flex-col gap-1 min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-3 leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {a.titre}
                        </h4>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(a.datePublication || a.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long'
                          })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            </div>
          </section>
        )}

        {/* ─── Dernières actualités ─── */}
        {mainLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
          </div>
        ) : mainArticles.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-4 md:mb-5">
              <h2 className="text-lg md:text-xl font-black text-gray-900 dark:text-white">
                Dernières actualités
              </h2>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              <div className="hidden md:grid grid-cols-12 gap-6">
                {mainArticles[0] && (
                  <div className="col-span-12 md:col-span-7">
                    <ArticleCard article={mainArticles[0]} hero />
                  </div>
                )}
                <div className="col-span-12 md:col-span-5 flex flex-col gap-4">
                  {mainArticles.slice(1, 3).map((a) => (
                    <ArticleCard key={a.id} article={a} compact />
                  ))}
                </div>
                {mainArticles.slice(3).map((a) => (
                  <div key={a.id} className="col-span-12 md:col-span-6 lg:col-span-3">
                    <ArticleCard article={a} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
                {mainArticles.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── Sections rubriques ─── */}
        {rubriquesFiltered.map((rubrique) => (
          <SectionRubrique
            key={rubrique.id}
            titre={rubrique.nom}
            articles={rubrique.articles}
            rubriqueId={rubrique.id}
          />
        ))}

      </div>
    </main>
  );
};

  // ─── Section rubrique ─────────────────────────────────────────
  const SectionRubrique = ({ titre, articles, rubriqueId }) => (
    <section>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-gray-900 dark:text-white border-l-4 border-primary-600 pl-3">
            {titre}
          </h2>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        </div>
        <Link
          to={`/?rubrique=${rubriqueId}`}
          className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline shrink-0"
        >
          Voir tout →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {articles.map((a) => <ArticleCard key={a.id} article={a} />)}
      </div>
    </section>
  );

export default Home;