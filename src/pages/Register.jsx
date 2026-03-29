import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRegister } from '../hooks/useAuth';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [form, setForm] = useState({
    nom: '', email: '', motDePasse: '', confirmMotDePasse: '',
  });
  const [errors, setErrors] = useState({});
  const { mutate: register, isPending, error } = useRegister();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.nom.trim())           newErrors.nom             = 'Le nom est requis.';
    if (!form.email.trim())         newErrors.email           = 'L\'email est requis.';
    if (form.motDePasse.length < 8) newErrors.motDePasse      = 'Minimum 8 caractères.';
    if (form.motDePasse !== form.confirmMotDePasse) {
      newErrors.confirmMotDePasse = 'Les mots de passe ne correspondent pas.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) return setErrors(newErrors);
    const { confirmMotDePasse, ...data } = form;
    register(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md">

        {/* ─── Card ─── */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 md:p-8">

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <Link to="/" className="inline-flex items-center gap-0.5 mb-4">
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-xl font-black text-gray-900 dark:text-white"
              >
                indepance
              </span>
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-xl font-black text-primary-600 dark:text-primary-400"
              >
                360
              </span>
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
              Créer un compte
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Rejoignez indepance360
            </p>
          </div>

          {/* Erreur API */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error.response?.data?.message || 'Une erreur est survenue.'}
              </p>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:gap-5">

            <Input
              label="Nom complet"
              type="text"
              name="nom"
              placeholder="Votre nom"
              value={form.nom}
              onChange={handleChange}
              error={errors.nom}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="motDePasse"
              placeholder="••••••••"
              value={form.motDePasse}
              onChange={handleChange}
              error={errors.motDePasse}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirmMotDePasse"
              placeholder="••••••••"
              value={form.confirmMotDePasse}
              onChange={handleChange}
              error={errors.confirmMotDePasse}
              required
            />

            <Button
              type="submit"
              loading={isPending}
              className="w-full mt-1"
            >
              Créer mon compte
            </Button>

          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5 md:mt-6">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;