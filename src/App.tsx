import { Routes, Route } from "react-router-dom";
import { Shell } from "@/components/layout/Shell";

// Pages
import Index from "@/pages/Index";
import CompaniesPage from "@/pages/Companies";
import CompanyDetailPage from "@/pages/CompanyDetail";
import QuestionsPage from "@/pages/Questions";
import PYQPage from "@/pages/PYQ";
import CodingPage from "@/pages/Coding";
import AptitudePage from "@/pages/Aptitude";
import TechnicalPage from "@/pages/Technical";
import InterviewsPage from "@/pages/Interviews";
import MocksPage from "@/pages/Mocks";
import AnalyticsPage from "@/pages/Analytics";
import BBDPage from "@/pages/BBD";
import DSASheetPage from "@/pages/DSASheet";
import SubmitPage from "@/pages/Submit";
import AdminPage from "@/pages/Admin";
import AuthPage from "@/pages/Auth";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Shell />}>
        <Route index element={<Index />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:slug" element={<CompanyDetailPage />} />
        <Route path="questions" element={<QuestionsPage />} />
        <Route path="pyq" element={<PYQPage />} />
        <Route path="coding" element={<CodingPage />} />
        <Route path="aptitude" element={<AptitudePage />} />
        <Route path="technical" element={<TechnicalPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="mocks" element={<MocksPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="bbd" element={<BBDPage />} />
        <Route path="dsa-sheet" element={<DSASheetPage />} />
        <Route path="submit" element={<SubmitPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
