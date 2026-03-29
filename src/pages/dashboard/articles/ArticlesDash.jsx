import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useArticles, useDeleteArticle } from '../../../hooks/useArticles';
import DataTable from '../../../components/dashboard/DataTable';
import Button from '../../../components/ui/Button';

const BADGES = {
  breaking_news: { label: '🔴 Breaking', style: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  une:           { label: '⭐ À la une', style: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' },
  exclusif:      { label: '💎 Exclusif', style: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  trending:      { label: '🔥 Trending', style: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400' },
};

const ArticlesDash = () => {
  const { user, isAdmin }    = useAuth();
  const [page, setPage]      = useState(1);

  const params = isAdmin
    ? { page, limit: 10 }
    : { page, limit: 10, redacteurId: user?.id };

  const { data, isLoading }                  = useArticles(params);
  const { mutate: deleteArticle, isPending } = useDeleteArticle();

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet article ?')) deleteArticle(id);
  };

  const statutBadge = (statut) => {
    const styles = {
      publie:    'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      brouillon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      archive:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[statut]}`}>
        {statut}
      </span>
    );
  };

  const badgeLabel = (badge) => {
    if (!badge) return <span className="text-gray-400 dark:text-gray-600 text-xs">—</span>;
    const b = BADGES[badge];
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.style}`}>
        {b.label}
      </span>
    );
  };

  const columns = [
    {
      key:   'titre',
      label: 'Titre',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
          {row.titre}
        </span>
      ),
    },
    {
      key:   'rubrique',
      label: 'Rubrique',
      width: '120px',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400">
          {row.rubrique?.nom ?? '—'}
        </span>
      ),
    },
    {
      key:   'statut',
      label: 'Statut',
      width: '110px',
      render: (row) => statutBadge(row.statut),
    },
    {
      key:   'badge',
      label: 'Badge',
      width: '130px',
      render: (row) => badgeLabel(row.badge),
    },
    {
      key:   'nombreVues',
      label: 'Vues',
      width: '80px',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400">{row.nombreVues}</span>
      ),
    },
    {
      key:   'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/dashboard/articles/${row.id}`}>
            <Button variant="secondary" size="sm">✏️</Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            loading={isPending}
            onClick={() => handleDelete(row.id)}
          >
            🗑️
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Header ─── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAdmin ? 'Tous les articles' : 'Mes articles'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {data?.pagination?.total ?? 0} article(s) au total
          </p>
        </div>
        <Link to="/dashboard/articles/new">
          <Button>✍️ Nouvel article</Button>
        </Link>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <DataTable
          columns={columns}
          data={data?.articles}
          isLoading={isLoading}
          emptyMessage="Aucun article pour le moment."
        />
      </div>

      {/* ─── Pagination ─── */}
      {data?.pagination?.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!data?.pagination?.hasPrev}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Précédent
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {page} / {data?.pagination?.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data?.pagination?.hasNext}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}

    </div>
  );
};

export default ArticlesDash;