import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth, type NavKey } from "./auth";
import { Layout } from "./components/Layout";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Cameras from "./pages/Cameras";
import Events from "./pages/Events";
import Screens from "./pages/Screens";
import Reception from "./pages/Reception";
import Lobby from "./pages/Lobby";
import Fnb from "./pages/Fnb";
import Wellness from "./pages/Wellness";
import Housekeeping from "./pages/Housekeeping";
import Boh from "./pages/Boh";
import Banquet from "./pages/Banquet";
import Parking from "./pages/Parking";
import Security from "./pages/Security";
import Lpr from "./pages/Lpr";
import Rules from "./pages/Rules";
import Assistant from "./pages/Assistant";
import AiReports from "./pages/AiReports";
import Occupancy from "./pages/Occupancy";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/Settings";

function Guard({ k, children }: { k: NavKey; children: React.ReactNode }) {
  const { can } = useAuth();
  return can(k) ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const page = (k: NavKey, el: React.ReactNode) => <Guard k={k}>{el}</Guard>;

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Overview />} />
        <Route path="/cameras" element={page("cameras", <Cameras />)} />
        <Route path="/events" element={page("events", <Events />)} />
        <Route path="/screens" element={page("screens", <Screens />)} />
        <Route path="/reception" element={page("reception", <Reception />)} />
        <Route path="/lobby" element={page("lobby", <Lobby />)} />
        <Route path="/fnb" element={page("fnb", <Fnb />)} />
        <Route path="/wellness" element={page("wellness", <Wellness />)} />
        <Route path="/housekeeping" element={page("housekeeping", <Housekeeping />)} />
        <Route path="/boh" element={page("boh", <Boh />)} />
        <Route path="/banquet" element={page("banquet", <Banquet />)} />
        <Route path="/parking" element={page("parking", <Parking />)} />
        <Route path="/security" element={page("security", <Security />)} />
        <Route path="/lpr" element={page("lpr", <Lpr />)} />
        <Route path="/rules" element={page("rules", <Rules />)} />
        <Route path="/assistant" element={page("assistant", <Assistant />)} />
        <Route path="/ai-reports" element={page("ai-reports", <AiReports />)} />
        <Route path="/occupancy" element={page("occupancy", <Occupancy />)} />
        <Route path="/reports" element={page("reports", <Reports />)} />
        <Route path="/settings" element={page("settings", <SettingsPage />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
