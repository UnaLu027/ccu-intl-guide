import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { CampusDataProvider } from "./contexts/CampusDataContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import CategoryResults from "./pages/CategoryResults";
import CampusMap from "./pages/CampusMap";
import Departments from "./pages/Departments";
import Offices from "./pages/Offices";
import Tasks from "./pages/Tasks";
import TaskDetail from "./pages/TaskDetail";
import StudentGuidePage from "./pages/StudentGuidePage";
import StudentGuideWelcomePage from "./pages/StudentGuideWelcomePage";
import RelatedSites from "./pages/RelatedSites";
import Navigation from "./pages/Navigation";
import Admin from "./pages/Admin";
import BackToTopButton from "@/components/BackToTopButton";
import CCUGPTWidget from "@/components/CCUGPTWidget";
import ScrollToTop from "@/components/ScrollToTop";

function LegacyHandbookRedirect() {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate("/guides/welcome", { replace: true });
  }, [navigate]);

  return null;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search" component={SearchResults} />
      <Route path="/category/:id" component={CategoryResults} />
      <Route path="/map" component={CampusMap} />
      <Route path="/departments" component={Departments} />
      <Route path="/offices" component={Offices} />
      <Route path="/tasks" component={Tasks} />
      <Route path="/task/:id" component={TaskDetail} />
      <Route path="/guides/welcome" component={StudentGuideWelcomePage} />
      <Route path="/guides/:guideId" component={StudentGuidePage} />
      <Route path="/guides" component={LegacyHandbookRedirect} />
      <Route path="/handbook" component={LegacyHandbookRedirect} />
      <Route path="/related-sites" component={RelatedSites} />
      <Route path="/navigate/:type/:id" component={Navigation} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/login" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <CampusDataProvider>
            <TooltipProvider>
              <Toaster />
              <ScrollToTop />
              <Router />
              <BackToTopButton />
              <CCUGPTWidget />
            </TooltipProvider>
          </CampusDataProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
