import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import CategoryResults from "./pages/CategoryResults";
import CampusMap from "./pages/CampusMap";
import Departments from "./pages/Departments";
import Offices from "./pages/Offices";
import Tasks from "./pages/Tasks";
import Navigation from "./pages/Navigation";
import CCUGPTWidget from "@/components/CCUGPTWidget";

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
      <Route path="/navigate/:type/:id" component={Navigation} />
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
          <TooltipProvider>
            <Toaster />
            <Router />
            <CCUGPTWidget />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
