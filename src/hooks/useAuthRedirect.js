import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { isTokenExpired } from "../utils/authUtils";

export default function useAuthRedirect() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isTokenExpired()) {
            localStorage.removeItem("accessToken");
            navigate("/login", { state: { message: "Acesso expirado. Faça login novamente.", from: location.pathname } });
        }
    }, []);
}
