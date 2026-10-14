import { Route, Routes, useLocation } from "react-router";
import { useEffect } from "react";
import AnalyticsPreferenceNotice from "./components/analytics/AnalyticsPreferenceNotice";
import Portfolio from "./components/pages/portfolio/Portfolio";
import Privacy from "./components/pages/privacy/Privacy";
import Resume from "./components/pages/resume/Resume";

import CaseStudy from "./components/pages/case-study/CaseStudy";

export default function AppRoutes() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <>
      <Routes>
        <Route path="/cv" element={<Resume />} />
        <Route path="/cv/microsoft" element={<Resume variant="microsoft" />} />
        <Route path="/cv/full-stack" element={<Resume variant="full-stack" />} />
        <Route path="/cv/project-management" element={<Resume variant="project-management" />} />
        <Route path="/projects/hr-commissions" element={<CaseStudy />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Portfolio />} />
      </Routes>
      <AnalyticsPreferenceNotice />
    </>
  );
}
