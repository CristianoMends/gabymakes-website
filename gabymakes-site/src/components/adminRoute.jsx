import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
    const userJson = localStorage.getItem("currentUser");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || user.role !== "admin") {
        return <Navigate to="*" replace />;
    }

    return children;
}
