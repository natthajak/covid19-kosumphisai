import { auth } from "../firebase";
import { Loading } from "../components/Loading";
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

function useAuth() {
    return useContext(AuthContext);
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function register(email, password) {
        return auth.createUserWithEmailAndPassword(email, password);
    }

    function login(email, password) {
        return auth.signInWithEmailAndPassword(email, password);
    }

    function logout() {
        return auth.signOut();
    }

    function isAuth() {
        return auth.currentUser;
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
            // Let the Firebase get the user first, then load the children
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user,
        register,
        login,
        logout,
        isAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? <Loading /> : children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };