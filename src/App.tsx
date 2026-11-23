import React, { useState } from 'react';
import AboutPage from './components/AboutPage';
import AreaMapPage from './components/AreaMapPage';
import AuthPages from './components/AuthPages';
import CitizenDashboard from './components/CitizenDashboard';
import CitizenServicesPage from './components/CitizenServicesPage';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import ProjectsPage from './components/ProjectsPage';
import RepresentativesPage from './components/RepresentativesPage';
import SchemesPage from './components/SchemesPage';
import { INITIAL_CITIZEN_REPORTS } from './data/karnatakaData';
import {
  CitizenReport,
  CitizenUser,
  ConstituencyId,
  PageId,
} from './types/jandrishti';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [selectedConstituency, setSelectedConstituency] =
    useState<ConstituencyId>('mangaluru');
  const [loggedInUser, setLoggedInUser] = useState<CitizenUser | null>(null);
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeEligibilitySchemeId, setActiveEligibilitySchemeId] = useState<
    string | null
  >(null);

  const handleNavigate = (page: PageId) => {
    if (page === 'dashboard' && !loggedInUser) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentPage('works');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSchemeEligibility = (schemeId: string) => {
    setActiveEligibilitySchemeId(schemeId);
    setCurrentPage('schemes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: CitizenUser) => {
    setLoggedInUser(user);
    setSelectedConstituency(user.constituencyId);
    setCurrentPage('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeDashboardConstituency = (id: ConstituencyId) => {
    setSelectedConstituency(id);
    setLoggedInUser((prev) => (prev ? { ...prev, constituencyId: id } : prev));
  };

  const handleSubmitReport = (
    payload: Omit<CitizenReport, 'id' | 'referenceCode' | 'submittedDate' | 'status'>
  ): CitizenReport => {
    const codePrefix = payload.constituencyId.slice(0, 3).toUpperCase();
    const num = 300 + reports.length + 1;
    const created: CitizenReport = {
      ...payload,
      id: `rep-${Date.now()}`,
      referenceCode: `JD-${codePrefix}-2026-${num}`,
      submittedDate: '23 Nov 2026',
      status: 'Submitted',
    };
    setReports((prev) => [created, ...prev]);
    return created;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FA] text-[#102A43]">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        loggedInUser={loggedInUser}
      />

      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            selectedConstituency={selectedConstituency}
            onSelectConstituency={setSelectedConstituency}
            onNavigate={handleNavigate}
            onOpenSchemeEligibility={handleOpenSchemeEligibility}
            onOpenProject={handleOpenProject}
          />
        )}

        {currentPage === 'representatives' && (
          <RepresentativesPage
            selectedConstituency={selectedConstituency}
            onSelectConstituency={setSelectedConstituency}
          />
        )}

        {currentPage === 'works' && (
          <ProjectsPage
            selectedConstituency={selectedConstituency}
            onSelectConstituency={setSelectedConstituency}
            activeProjectId={activeProjectId}
            onSelectProjectId={setActiveProjectId}
          />
        )}

        {currentPage === 'schemes' && (
          <SchemesPage
            selectedConstituency={selectedConstituency}
            activeEligibilitySchemeId={activeEligibilitySchemeId}
            onSetEligibilitySchemeId={setActiveEligibilitySchemeId}
          />
        )}

        {currentPage === 'map' && (
          <AreaMapPage
            selectedConstituency={selectedConstituency}
            onSelectConstituency={setSelectedConstituency}
            onOpenProject={handleOpenProject}
          />
        )}

        {currentPage === 'services' && (
          <CitizenServicesPage
            selectedConstituency={selectedConstituency}
            reports={reports}
            onSubmitReport={handleSubmitReport}
            reporterName={
              loggedInUser ? loggedInUser.fullName : 'Guest Citizen (Demo)'
            }
          />
        )}

        {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

        {(currentPage === 'login' || currentPage === 'register') && (
          <AuthPages
            mode={currentPage}
            onSwitchMode={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentPage === 'dashboard' && loggedInUser && (
          <CitizenDashboard
            user={loggedInUser}
            onChangeConstituency={handleChangeDashboardConstituency}
            onLogout={handleLogout}
            onNavigate={handleNavigate}
            onOpenProject={handleOpenProject}
            onOpenSchemeEligibility={handleOpenSchemeEligibility}
            reports={reports}
          />
        )}
      </main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
