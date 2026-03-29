import { useSearchParams, Link } from 'react-router-dom';
import { useArticles,useSearch  } from '../hooks/useArticles';
import { useRubriques, useRubriquesWithArticles } from '../hooks/useRubriques';
import ArticleCarousel from '../components/article/ArticleCarousel';
import ArticleCard from '../components/article/ArticleCard';
import ArticleSkeleton from '../components/article/ArticleSkeleton';

const Home = () => {
  const [searchParams]  = useSearchParams();
  const rubriqueId      = searchParams.get('rubrique');
  const search          = searchParams.get('search');

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

  // ─── Rubriques avec articles ───────────────────────────────
  const { data: rubriques }              = useRubriques();
  const { data: rubriquesWithArticles }  = useRubriquesWithArticles(3);

  const rubriquesFiltered = (rubriquesWithArticles || []).map(r => ({
    ...r,
    articles: r.articles.filter(a => !carouselIds.has(a.id)),
  })).filter(r => r.articles.length > 0);

  // ─── Meilisearch  ───────────────────────────────
  const { data: searchData, isLoading: searchLoading } = useSearch(
    search || '',
    { page: 1, limit: 10 }
  );

  // ─── Page recherche ────────────────────────────────────────
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
              <p className="text-gray-500 dark:text-gray-400">
                Aucun article trouvé pour "{search}"
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Essayez avec d'autres mots-clés
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(searchData?.articles || []).map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
      </div>

      </main>
    );
  }

  // ─── Page rubrique filtrée ─────────────────────────────────
  if (rubriqueId) {
    return (
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">
            {rubriques?.find(r => r.id === rubriqueId)?.nom ?? 'Articles'}
          </h1>
          {mainLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
            </div>
          ) : (mainData?.articles || []).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500 dark:text-gray-400">Aucun article dans cette rubrique.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {(mainData?.articles || []).map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          )}
        </div>
      </main>
    );
  }

  // ─── Page accueil ──────────────────────────────────────────
  return (
    <main className="max-w-7xl mx-auto px-4 py-4 md:py-6">
      <div className="flex flex-col gap-8 md:gap-10">

        {/* ─── Carousel ─── */}
        {carouselArticles.length > 0 && (
          <section>
            <ArticleCarousel articles={carouselArticles} />
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

            {/* ─── Layout responsive ─── */}
            <div className="flex flex-col gap-4 md:gap-6">

              {/* Hero + sidebar — caché sur mobile, grille simple */}
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

              {/* Mobile — grille simple 1 colonne */}
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

// ─── Section rubrique ──────────────────────────────────────────
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