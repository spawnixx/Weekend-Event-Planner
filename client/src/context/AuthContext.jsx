import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logoutUser } from "@/api/authApi";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();

        setUser(data);
      } catch (err) {
        if (err.status === 401) {
          setUser(null);
          return;
        } else {
          console.error("Unable to load user:", err);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (data) => {
    setUser(data);
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      localStorage.removeItem("pendingInvite");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
