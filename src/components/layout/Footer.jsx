import { Link } from 'react-router-dom';
import { useRubriques } from '../../hooks/useRubriques';

const Footer = () => {
  const { data: rubriques } = useRubriques();

  return (
    <footer className="mt-auto bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* ─── Logo + description ─── */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-0.5">
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-black text-gray-900 dark:text-white"
              >
                indepance
              </span>
              <span
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-2xl font-black text-primary-600 dark:text-primary-400"
              >
                360
              </span>
            </Link>

            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Toute l'actualité en temps réel. Restez informé avec les dernières nouvelles du Sénégal et du monde entier.
            </p>

            {/* ─── Réseaux sociaux ─── */}
            <div className="flex items-center gap-3 mt-2">

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-600 dark:hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all"
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

            </div>
          </div>

          {/* ─── Rubriques ─── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Rubriques
            </h3>
            <ul className="flex flex-col gap-2">
              {rubriques?.map((rubrique) => (
                <li key={rubrique.id}>
                  <Link
                    to={`/?rubrique=${rubrique.id}`}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {rubrique.nom}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── Navigation ─── */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* ─── Newsletter ─── */}
        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Newsletter indepance360
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Recevez les dernières actualités directement dans votre boîte mail.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="votre@email.com"
                className="flex-1 md:w-72 pl-4 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="shrink-0 px-5 py-2.5 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-full transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* ─── Bas du footer ─── */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} indepance360. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Fait avec ❤️ au Sénégal 🇸🇳
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;