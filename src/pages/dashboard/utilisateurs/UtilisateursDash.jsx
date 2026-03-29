import { useState } from 'react';
import {
  useUtilisateurs,
  useUpdateUtilisateur,
  useDeleteUtilisateur,
} from '../../../hooks/useUtilisateurs';
import DataTable from '../../../components/dashboard/DataTable';
import Button from '../../../components/ui/Button';

const ROLES = ['admin', 'redacteur', 'lecteur'];

const UtilisateursDash = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading }                          = useUtilisateurs({ page, limit: 10 });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUtilisateur();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUtilisateur();

  const handleRoleChange = (id, role) => {
    updateUser({ id, data: { role } });
  };

  const handleToggleActif = (id, actif) => {
    updateUser({ id, data: { actif: !actif } });
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cet utilisateur ?')) deleteUser(id);
  };

  const roleBadge = (role) => {
    const styles = {
      admin:     'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400',
      redacteur: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      lecteur:   'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
    };
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[role]}`}>
        {role}
      </span>
    );
  };

  const columns = [
    {
      key:   'nom',
      label: 'Utilisateur',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
            {row.nom?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{row.nom}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key:   'role',
      label: 'Rôle',
      width: '150px',
      render: (row) => (
        <select
          value={row.role}
          onChange={(e) => handleRoleChange(row.id, e.target.value)}
          className="px-2 py-1 rounded-lg border text-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      ),
    },
    {
      key:   'actif',
      label: 'Statut',
      width: '100px',
      render: (row) => (
        <button
          onClick={() => handleToggleActif(row.id, row.actif)}
          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
            row.actif
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200'
          }`}
        >
          {row.actif ? 'Actif' : 'Inactif'}
        </button>
      ),
    },
    {
      key:   'created_at',
      label: 'Inscrit le',
      width: '130px',
      render: (row) => (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(row.created_at).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
    {
      key:   'actions',
      label: 'Actions',
      width: '80px',
      render: (row) => (
        <Button
          variant="danger"
          size="sm"
          loading={isDeleting}
          onClick={() => handleDelete(row.id)}
        >
          🗑️
        </Button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ─── Header ─── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Utilisateurs
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {data?.pagination?.total ?? 0} utilisateur(s) au total
        </p>
      </div>

      {/* ─── Table ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <DataTable
          columns={columns}
          data={data?.utilisateurs}
          isLoading={isLoading}
          emptyMessage="Aucun utilisateur pour le moment."
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

export default UtilisateursDash;