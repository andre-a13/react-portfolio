import { Route, Routes } from "react-router";
import Portfolio from "./components/pages/portfolio/Portfolio";
import Resume from "./components/pages/resume/Resume";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/cv" element={<Resume />} />
      <Route path="/cv/microsoft" element={<Resume variant="microsoft" />} />
      <Route path="/cv/full-stack" element={<Resume variant="full-stack" />} />
      <Route path="*" element={<Portfolio />} />
    </Routes>
  );
}
