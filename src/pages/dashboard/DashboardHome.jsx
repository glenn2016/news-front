import { useAuth } from '../../context/AuthContext';
import { useArticles } from '../../hooks/useArticles';
import { useUtilisateurs } from '../../hooks/useUtilisateurs';
import { useRubriques } from '../../hooks/useRubriques';
import StatCard from '../../components/dashboard/StatCard';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user, isAdmin } = useAuth();

  const { data: articlesData }  = useArticles({ limit: 100 });
  const { data: usersData }     = useUtilisateurs();
  const { data: rubriques }     = useRubriques();
  const { data: mesArticles }   = useArticles({ redacteurId: user?.id, limit: 100 });

  const totalArticles   = articlesData?.pagination?.total ?? 0;
  const totalUsers      = usersData?.pagination?.total    ?? 0;
  const totalRubriques  = rubriques?.length               ?? 0;
  const mesTotalArticles = mesArticles?.pagination?.total ?? 0;

  return (
    <div className="flex flex-col gap-6 md:gap-8">

      {/* ─── Header ─── */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Bonjour {user?.nom} 👋
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Voici un aperçu de votre tableau de bord.
        </p>
      </div>

      {/* ─── Stats ─── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {isAdmin ? (
          <>
            <StatCard label="Total articles" value={totalArticles}   icon="📝" color="primary" />
            <StatCard label="Utilisateurs"   value={totalUsers}      icon="👥" color="purple" />
            <StatCard label="Rubriques"      value={totalRubriques}  icon="🗂️" color="orange" />
            <StatCard
              label="Publiés"
              value={articlesData?.articles?.filter(a => a.statut === 'publie').length ?? 0}
              icon="✅"
              color="green"
            />
          </>
        ) : (
          <>
            <StatCard label="Mes articles" value={mesTotalArticles} icon="📝" color="primary" />
            <StatCard
              label="Publiés"
              value={mesArticles?.articles?.filter(a => a.statut === 'publie').length ?? 0}
              icon="✅"
              color="green"
            />
            <StatCard
              label="Brouillons"
              value={mesArticles?.articles?.filter(a => a.statut === 'brouillon').length ?? 0}
              icon="📄"
              color="orange"
            />
            <StatCard label="Rubriques" value={totalRubriques} icon="🗂️" color="purple" />
          </>
        )}
      </div>

      {/* ─── Raccourcis ─── */}
      <div>
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-3 md:mb-4">
          Actions rapides
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">

          <Link
            to="/dashboard/articles/new"
            className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
          >
            <span className="text-2xl md:text-3xl">✍️</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                Nouvel article
              </p>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                Rédiger et publier
              </p>
            </div>
          </Link>

          {isAdmin && (
            <Link
              to="/dashboard/rubriques"
              className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
            >
              <span className="text-2xl md:text-3xl">🗂️</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                  Gérer les rubriques
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Créer, modifier, supprimer
                </p>
              </div>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/dashboard/utilisateurs"
              className="flex items-center gap-3 md:gap-4 p-4 md:p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all"
            >
              <span className="text-2xl md:text-3xl">👥</span>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                  Gérer les utilisateurs
                </p>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Rôles et accès
                </p>
              </div>
            </Link>
          )}

        </div>
      </div>
    </div>
  );
};

export default DashboardHome;