import { Toaster } from "@/components/ui/sonner";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <Toaster richColors position="top-center" />
    </>
  );
}

export default App;
