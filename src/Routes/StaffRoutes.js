import { Routes, Route } from "react-router-dom";
import Staff from "./components/Staff";

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path="/staff" element={<Staff />} />
        </Routes>
    )
}
