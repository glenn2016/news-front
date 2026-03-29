import { useState } from 'react';
import {
  useRubriques,
  useCreateRubrique,
  useUpdateRubrique,
  useDeleteRubrique,
} from '../../../hooks/useRubriques';
import DataTable from '../../../components/dashboard/DataTable';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const RubriquesDash = () => {
  const [form, setForm]       = useState({ nom: '', description: '' });
  const [editing, setEditing] = useState(null); // rubrique en cours d'édition
  const [showForm, setShowForm] = useState(false);

  const { data: rubriques, isLoading }           = useRubriques();
  const { mutate: createRubrique, isPending: isCreating } = useCreateRubrique();
  const { mutate: updateRubrique, isPending: isUpdating } = useUpdateRubrique();
  const { mutate: deleteRubrique, isPending: isDeleting } = useDeleteRubrique();

  const handleEdit = (rubrique) => {
    setEditing(rubrique);
    setForm({ nom: rubrique.nom, description: rubrique.description ?? '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditing(null);
    setForm({ nom: '', description: '' });
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateRubrique({ id: editing.id, data: form }, { onSuccess: handleCancel });
    } else {
      createRubrique(form, { onSuccess: handleCancel });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Supprimer cette rubrique ?')) deleteRubrique(id);
  };

  const columns = [
    {
      key:   'nom',
      label: 'Nom',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">{row.nom}</span>
      ),
    },
    {
      key:   'description',
      label: 'Description',
      render: (row) => (
        <span className="text-gray-500 dark:text-gray-400">
          {row.description ?? '—'}
        </span>
      ),
    },
    {
      key:   'actif',
      label: 'Statut',
      width: '100px',
      render: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
          row.actif
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
        }`}>
          {row.actif ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key:   'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => handleEdit(row)}>
            ✏️
          </Button>
          <Button
            variant="danger"
            size="sm"
            loading={isDeleting}
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rubriques</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {rubriques?.length ?? 0} rubrique(s)
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            ➕ Nouvelle rubrique
          </Button>
        )}
      </div>

      {/* ─── Formulaire create/edit ─── */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">
            {editing ? 'Modifier la rubrique' : 'Nouvelle rubrique'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              name="nom"
              placeholder="Ex: Technologie"
              value={form.nom}
              onChange={(e) => setForm((p) => ({ ...p, nom: e.target.value }))}
              required
            />
            <Input
              label="Description"
              name="description"
              placeholder="Description de la rubrique"
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
            <Button variant="secondary" onClick={handleCancel} type="button">
              Annuler
            </Button>
            <Button type="submit" loading={isCreating || isUpdating}>
              {editing ? 'Sauvegarder' : 'Créer'}
            </Button>
          </div>
        </form>
      )}

      {/* ─── Table ─── */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <DataTable
          columns={columns}
          data={rubriques}
          isLoading={isLoading}
          emptyMessage="Aucune rubrique pour le moment."
        />
      </div>

    </div>
  );
};

export default RubriquesDash;