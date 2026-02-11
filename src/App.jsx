import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Layout from './components/Layout';
import Home from './pages/Home';
import WatchLive from './pages/WatchLive';
import CreateMatch from './pages/CreateMatch';
import MatchSetup from './pages/MatchSetup';
import LiveScoring from './pages/LiveScoring';
import MatchResult from './pages/MatchResult';
import TournamentSetup from './pages/TournamentSetup';
import TournamentDashboard from './pages/TournamentDashboard';
import { MatchProvider } from './context/MatchContext';
import { TournamentProvider } from './context/TournamentContext';

function App() {
  return (
    <MatchProvider>
      <TournamentProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/live" element={<WatchLive />} />
              <Route path="/match/:id" element={<LiveScoring viewOnly={true} />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<CreateMatch />} />
              <Route path="/admin/setup/:id" element={<MatchSetup />} />
              <Route path="/admin/live/:id" element={<LiveScoring viewOnly={false} />} />
              <Route path="/result/:id" element={<MatchResult />} />

              {/* Tournament Routes */}
              <Route path="/tournament/new" element={<TournamentSetup />} />
              <Route path="/tournament/:id" element={<TournamentDashboard />} />
            </Routes>
            <Toaster position="top-center" richColors />
          </Layout>
        </BrowserRouter>
      </TournamentProvider>
    </MatchProvider>
  );
}

export default App;
