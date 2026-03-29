import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLogout } from '../../hooks/useAuth';
import { useRubriques } from '../../hooks/useRubriques';
import Button from '../ui/Button';

const Navbar = () => {
  const { isAuthenticated, user, isAdmin, isRedacteur } = useAuth();
  const { theme, toggleTheme }        = useTheme();
  const { mutate: logout, isPending } = useLogout();
  const { data: rubriques }           = useRubriques();
  const navigate                      = useNavigate();

  const [search, setSearch]         = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/?search=${encodeURIComponent(search.trim())}`);
    setSearch('');
    setShowSearch(false);
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">

      {/* ─── Barre principale ─── */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">

        {/* ─── Logo ─── */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-0.5 shrink-0">
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

        {/* ─── Recherche desktop ─── */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            />
            <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        {/* ─── Actions droite ─── */}
        <div className="flex items-center gap-1 shrink-0">

          {/* Loupe mobile */}
          <button
            onClick={() => { setShowSearch(!showSearch); setMenuOpen(false); }}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Toggle dark/light */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'dark' ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">👋 {user?.nom}</span>
                {(isAdmin || isRedacteur) && (
                  <Link to="/dashboard">
                    <Button variant="secondary" size="sm">📊 Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" size="sm" loading={isPending}
                  onClick={() => logout(localStorage.getItem('refreshToken'))}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Connexion</Button></Link>
                <Link to="/register"><Button size="sm">Inscription</Button></Link>
              </>
            )}
          </div>

          {/* ─── Hamburger mobile ─── */}
          <button
            onClick={() => { setMenuOpen(!menuOpen); setShowSearch(false); }}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {menuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        </div>
      </div>

      {/* ─── Recherche mobile ─── */}
      {showSearch && (
        <div className="md:hidden px-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Menu mobile ─── */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">

          {/* Rubriques mobile */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rubriques</p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                onClick={closeMenu}
                className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                Accueil
              </Link>
              {rubriques?.map((r) => (
                <Link
                  key={r.id}
                  to={`/?rubrique=${r.id}`}
                  onClick={closeMenu}
                  className="px-3 py-1.5 text-sm font-semibold rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {r.nom}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth mobile */}
          <div className="px-4 py-4 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-gray-600 dark:text-gray-400">👋 {user?.nom}</p>
                {(isAdmin || isRedacteur) && (
                  <Link to="/dashboard" onClick={closeMenu}>
                    <Button variant="secondary" className="w-full">📊 Dashboard</Button>
                  </Link>
                )}
                <Button variant="ghost" loading={isPending} className="w-full"
                  onClick={() => { logout(localStorage.getItem('refreshToken')); closeMenu(); }}>
                  Déconnexion
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={closeMenu}>
                  <Button variant="secondary" className="w-full">Connexion</Button>
                </Link>
                <Link to="/register" onClick={closeMenu}>
                  <Button className="w-full">Inscription</Button>
                </Link>
              </>
            )}
          </div>

        </div>
      )}

      {/* ─── Barre rubriques desktop ─── */}
      <div className="hidden md:block border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide h-10">
            <Link
              to="/"
              className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                !new URLSearchParams(window.location.search).get('rubrique') &&
                !new URLSearchParams(window.location.search).get('search')
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Accueil
            </Link>
            {rubriques?.map((rubrique) => (
              <Link
                key={rubrique.id}
                to={`/?rubrique=${rubrique.id}`}
                className={`shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                  new URLSearchParams(window.location.search).get('rubrique') === rubrique.id
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {rubrique.nom}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </nav>
  );
};

export default Navbar;