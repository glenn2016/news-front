import { useState } from 'react';
import { useArticles } from '../../hooks/useArticles';
import ArticleCard from './ArticleCard';
import ArticleSkeleton from './ArticleSkeleton';

const ArticleList = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useArticles({ page, limit: 9 });

  // ─── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  // ─── Erreur ────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">😕</p>
        <p className="text-gray-500 dark:text-gray-400">
          Impossible de charger les articles. Réessayez plus tard.
        </p>
      </div>
    );
  }

  // ─── Vide ──────────────────────────────────────────────────
  if (!data?.articles?.length) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-4">📭</p>
        <p className="text-gray-500 dark:text-gray-400">
          Aucun article disponible pour le moment.
        </p>
      </div>
    );
  }

  const { articles, pagination } = data;

  return (
    <div className="flex flex-col gap-10">

      {/* ─── Grille articles ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* ─── Pagination ─── */}
      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">

          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Précédent
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                  page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Suivant →
          </button>

        </div>
      )}

    </div>
  );
};

export default ArticleList;