import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <>
      {isAuthenticated && <NavBar />}
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
