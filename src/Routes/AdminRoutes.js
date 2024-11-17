import { Routes, Route } from "react-router-dom";
import Admin from "./components/Admin";

const AdminRoutes = () => {
    return (
        <Routes>
             <Route path="/admin" element={<Admin />} />
        </Routes>
    )
}

export default AdminRoutes;