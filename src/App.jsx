import { Routes, Route, Navigate } from 'react-router-dom';

// ─── Layout ───────────────────────────────────────────────────
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// ─── Protected Routes ─────────────────────────────────────────
import { AdminRoute, RedacteurRoute } from './components/ProtectedRoute';

// ─── Pages publiques ──────────────────────────────────────────
import Home     from './pages/Home';
import Article  from './pages/Article';
import Login    from './pages/Login';
import Register from './pages/Register';

// ─── Dashboard ────────────────────────────────────────────────
import DashboardLayout   from './pages/dashboard/DashboardLayout';
import DashboardHome     from './pages/dashboard/DashboardHome';
import ArticlesDash      from './pages/dashboard/articles/ArticlesDash';
import ArticleCreate     from './pages/dashboard/articles/ArticleCreate';
import ArticleEdit       from './pages/dashboard/articles/ArticleEdit';
import RubriquesDash     from './pages/dashboard/rubriques/RubriquesDash';
import UtilisateursDash  from './pages/dashboard/utilisateurs/UtilisateursDash';

// ─── Layout public avec Navbar + Footer ───────────────────────
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

const App = () => {
  return (
    <Routes>

      {/* ─── Pages publiques ─── */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/articles/:id" element={<PublicLayout><Article /></PublicLayout>} />
      <Route path="/login"    element={<PublicLayout><Login /></PublicLayout>} />
      <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

      {/* ─── Dashboard ─── */}
      <Route
        path="/dashboard"
        element={
          <RedacteurRoute>
            <DashboardLayout />
          </RedacteurRoute>
        }
      >
        <Route index element={<DashboardHome />} />

        {/* Articles — redacteur + admin */}
        <Route path="articles"     element={<ArticlesDash />} />
        <Route path="articles/new" element={<ArticleCreate />} />
        <Route path="articles/:id" element={<ArticleEdit />} />

        {/* Rubriques — admin seulement */}
        <Route
          path="rubriques"
          element={
            <AdminRoute>
              <RubriquesDash />
            </AdminRoute>
          }
        />

        {/* Utilisateurs — admin seulement */}
        <Route
          path="utilisateurs"
          element={
            <AdminRoute>
              <UtilisateursDash />
            </AdminRoute>
          }
        />
      </Route>

      {/* ─── 404 ─── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default App;