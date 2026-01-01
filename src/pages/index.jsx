// src/pages/index.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import Layout from "@/pages/Layout.jsx";
import Home from "@/pages/Home.jsx";

const About = lazy(() => import("@/pages/About.jsx"));
const Contact = lazy(() => import("@/pages/Contact.jsx"));

const ServicesOverview = lazy(() => import("@/pages/ServicesOverview.jsx"));
const Services = lazy(() => import("@/pages/Services.jsx"));
const InspectionsTesting = lazy(() => import("@/pages/InspectionsTesting.jsx"));
const SpecialInspections = lazy(() => import("@/pages/SpecialInspections.jsx"));
const StructuralEngineering = lazy(() => import("@/pages/StructuralEngineering.jsx"));
const Construction = lazy(() => import("@/pages/Construction.jsx"));

const ProjectGallery = lazy(() => import("@/pages/ProjectGallery.jsx"));
const ProjectDetail = lazy(() => import("@/pages/ProjectDetail.jsx"));
const PreviousWork = lazy(() => import("@/pages/PreviousWork.jsx"));

const Blog = lazy(() => import("@/pages/Blog.jsx"));
const BlogPost = lazy(() => import("@/pages/BlogPost.jsx"));

const SWPPPChecker = lazy(() => import("@/pages/SWPPPChecker.jsx"));

function PageLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-slate-600">
      Loading…
    </div>
  );
}

export default function Pages() {
  return (
    <Router>
      <Layout currentPageName="Home">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Main */}
            <Route path={createPageUrl("About")} element={<About />} />
            <Route path={createPageUrl("Contact")} element={<Contact />} />

            {/* Services */}
            <Route path={createPageUrl("ServicesOverview")} element={<ServicesOverview />} />
            <Route path={createPageUrl("Services")} element={<Services />} />
            <Route path={createPageUrl("InspectionsTesting")} element={<InspectionsTesting />} />
            <Route path={createPageUrl("SpecialInspections")} element={<SpecialInspections />} />
            <Route path={createPageUrl("StructuralEngineering")} element={<StructuralEngineering />} />
            <Route path={createPageUrl("Construction")} element={<Construction />} />

            {/* Projects */}
            <Route path={createPageUrl("ProjectGallery")} element={<ProjectGallery />} />
            <Route path={createPageUrl("ProjectDetail")} element={<ProjectDetail />} />
            <Route path={createPageUrl("PreviousWork")} element={<PreviousWork />} />

            {/* Blog */}
            <Route path={createPageUrl("Blog")} element={<Blog />} />
            <Route path={createPageUrl("BlogPost")} element={<BlogPost />} />

            {/* Consultation */}
            <Route path={createPageUrl("SWPPPChecker")} element={<SWPPPChecker />} />

            {/* Legacy */}
            <Route path="/swppp-checker" element={<Navigate to="/consultation" replace />} />
            <Route path="/SWPPPChecker" element={<Navigate to="/consultation" replace />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}
