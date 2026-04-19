import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useArticle, useUpdateArticle } from '../../../hooks/useArticles';
import { useRubriques } from '../../../hooks/useRubriques';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';
import ImageUpload from '../../../components/ui/ImageUpload';

const ArticleEdit = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { data: article, isLoading }                = useArticle(id);
  const { data: rubriques  = [] }                         = useRubriques();
  const { mutate: updateArticle, isPending, error } = useUpdateArticle();

  const [form, setForm] = useState({
    titre: '', contenu: '', statut: 'brouillon',
    badge: '',             // ← Ajouté
    imagePrincipale: '', rubriqueId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (article) {
      setForm({
        titre:           article.titre           ?? '',
        contenu:         article.contenu         ?? '',
        statut:          article.statut          ?? 'brouillon',
        badge:           article.badge           ?? '',  // ← Ajouté
        imagePrincipale: article.imagePrincipale ?? '',
        rubriqueId:      article.rubrique?.id    ?? '',
      });
    }
  }, [article]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.titre.trim())   newErrors.titre      = 'Le titre est requis.';
    if (!form.contenu.trim()) newErrors.contenu    = 'Le contenu est requis.';
    if (!form.rubriqueId)     newErrors.rubriqueId = 'La rubrique est requise.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    const data = { ...form };
    if (!data.badge) data.badge = null; // ← null si aucun badge

    updateArticle({ id, data }, {
      onSuccess: () => navigate('/dashboard/articles'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl">

      <div className="flex items-center gap-4">
        <Link to="/dashboard/articles" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">←</Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier l'article</h1>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">
            {error.response?.data?.message || 'Une erreur est survenue.'}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 flex flex-col gap-6">
        
        {/* Images */}

        <ImageUpload
          value={form.imagePrincipale}
          onChange={(url) => setForm((prev) => ({ ...prev, imagePrincipale: url }))}
        />
        {/* Rubrique */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Rubrique</label>
          <select name="rubriqueId" value={form.rubriqueId} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
            <option value="">Sélectionner une rubrique</option>
            {rubriques?.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
          </select>
          {errors.rubriqueId && <span className="text-xs text-red-500">{errors.rubriqueId}</span>}
        </div>

        {/* Statut */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
          <select name="statut" value={form.statut} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
            <option value="brouillon">Brouillon</option>
            <option value="publie">Publié</option>
            <option value="archive">Archivé</option>
          </select>
        </div>

        {/* Badge ← Ajouté */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Badge</label>
          <select name="badge" value={form.badge} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors">
            <option value="">Aucun badge</option>
            <option value="une">⭐ À la une</option>
            <option value="breaking_news">🔴 Breaking News</option>
            <option value="exclusif">💎 Exclusif</option>
            <option value="trending">🔥 Trending</option>
          </select>
        </div>

        <Input label="Image principale (URL)" name="imagePrincipale" value={form.imagePrincipale} onChange={handleChange} />

        {/* Contenu */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contenu</label>
          <textarea name="contenu" value={form.contenu} onChange={handleChange} rows={12}
            className="w-full px-4 py-2.5 rounded-lg border text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors resize-none"
          />
          {errors.contenu && <span className="text-xs text-red-500">{errors.contenu}</span>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100 dark:border-gray-800">
          <Link to="/dashboard/articles"><Button variant="secondary">Annuler</Button></Link>
          <Button type="submit" loading={isPending}>Sauvegarder</Button>
        </div>

      </form>
    </div>
  );
};

export default ArticleEdit;