import { createContext, useContext, useEffect, useState } from "react";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("http://localhost:3001/users/profile", {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        const data = await res.json();

        setUser(data);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = (data) => {
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await fetch("http://localhost:3001/users/logout", {
        method: "POST",
        credentials: "include",
      });
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
