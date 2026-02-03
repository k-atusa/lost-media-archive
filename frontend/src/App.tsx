import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BrowsePage from './pages/BrowsePage';
import ViewPage from './pages/ViewPage';
import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import CollectionsPage from './pages/CollectionsPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="view/:id" element={<ViewPage />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="collections" element={<CollectionsPage />} />
        <Route path="about" element={<AboutPage />} />
      </Route>
    </Routes>
  );
}

export default App;
