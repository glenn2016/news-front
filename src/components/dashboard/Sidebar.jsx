import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLogout } from '../../hooks/useAuth';

const adminLinks = [
  { to: '/dashboard',              label: 'Tableau de bord', icon: '📊' },
  { to: '/dashboard/articles',     label: 'Articles',        icon: '📝' },
  { to: '/dashboard/rubriques',    label: 'Rubriques',       icon: '🗂️'  },
  { to: '/dashboard/utilisateurs', label: 'Utilisateurs',    icon: '👥' },
];

const redacteurLinks = [
  { to: '/dashboard',          label: 'Tableau de bord', icon: '📊' },
  { to: '/dashboard/articles', label: 'Mes articles',    icon: '📝' },
];

const Sidebar = ({ onClose }) => {
  const { user, isAdmin } = useAuth();
  const { mutate: logout, isPending } = useLogout();
  const links = isAdmin ? adminLinks : redacteurLinks;

  return (
    <aside className="w-64 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">

      {/* ─── Header sidebar ─── */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <span
          style={{ fontFamily: "'Playfair Display', serif" }}
          className="font-black text-primary-600 dark:text-primary-400"
        >
          indepance<span className="text-gray-900 dark:text-white">360</span>
        </span>

        {/* Bouton close mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* ─── User info ─── */}
      <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="h-9 w-9 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-sm font-bold text-primary-600 dark:text-primary-400 shrink-0">
            {user?.nom?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {user?.nom}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Navigation ─── */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* ─── Footer sidebar ─── */}
      <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2 shrink-0">
        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span>🌐</span>
          <span>Voir le site</span>
        </NavLink>
        <button
          onClick={() => logout(localStorage.getItem('refreshToken'))}
          disabled={isPending}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 w-full"
        >
          <span>🚪</span>
          <span>{isPending ? 'Déconnexion...' : 'Déconnexion'}</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;