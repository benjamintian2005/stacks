import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import RequireSession from './components/RequireSession';
import RouteStub from './components/RouteStub';
import AuthPage from './pages/AuthPage';
import ChooseUsernamePage from './pages/ChooseUsernamePage';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';
import MediaDetailPage from './pages/MediaDetailPage';
import ProfilePage from './pages/ProfilePage';
import ListsPage from './pages/ListsPage';
import NewListPage from './pages/NewListPage';
import ListDetailPage from './pages/ListDetailPage';
import FeedPage from './pages/FeedPage';
import ImportWizardPage from './pages/ImportWizardPage';
import ImportReviewPage from './pages/ImportReviewPage';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/welcome"
          element={
            <RequireSession>
              <ChooseUsernamePage />
            </RequireSession>
          }
        />

        <Route element={<AuthenticatedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover/:mediaTypeSlug" element={<DiscoverPage />} />
          <Route path="/media/:mediaItemId" element={<MediaDetailPage />} />
          <Route path="/u/:username" element={<ProfilePage />} />
          <Route path="/u/:username/library/:mediaTypeSlug" element={<RouteStub title="Library" />} />
          <Route path="/u/:username/diary" element={<RouteStub title="Diary" />} />
          <Route path="/u/:username/lists" element={<ListsPage />} />
          <Route path="/lists/new" element={<NewListPage />} />
          <Route path="/lists/:listId" element={<ListDetailPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/import" element={<ImportWizardPage />} />
          <Route path="/import/:jobId" element={<ImportReviewPage />} />
          <Route path="/settings" element={<RouteStub title="Settings" />} />
          <Route path="*" element={<RouteStub title="Page not found" />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
