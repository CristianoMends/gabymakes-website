import { Navigate } from "react-router-dom";

export default function UserRoute({ children }) {
    const userJson = localStorage.getItem("currentUser");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user || user.role !== "user") {
        return <Navigate to="*" replace />;
    }

    return children;
}
