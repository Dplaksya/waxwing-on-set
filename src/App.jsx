// src/App.jsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/ui/Header.jsx";
import Footer from "./components/ui/Footer.jsx";

const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const GearListPage = lazy(() => import("./pages/GearListPage.jsx"));
const QuotePage = lazy(() => import("./pages/QuotePage.jsx"));
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));

function Loading({ label = "Loading…" }) {
  return <div className="p-8 text-sm text-black/60">{label}</div>;
}

class SectionBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { error: null };
  }
  static getDerivedStateFromError(e) {
    return { error: e };
  }
  componentDidCatch(e, info) {
    console.error(`[SectionBoundary:${this.props.label}]`, e, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="m-4 p-4 rounded-lg bg-red-50 text-red-900">
          <strong>{this.props.label} crashed:</strong>
          <div className="mt-2 whitespace-pre-wrap">
            {String(this.state.error?.message || this.state.error)}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppInner() {
  const { pathname } = useLocation();

  // Scroll to top on each route change (instant, no smooth behavior)
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <>
      <SectionBoundary label="Header">
        <Suspense fallback={<Loading label="Loading header…" />}>
          <Header />
        </Suspense>
      </SectionBoundary>

      <Routes>
        <Route
          path="/"
          element={
            <SectionBoundary label="Home">
              <Suspense fallback={<Loading />}>
                <HomePage />
              </Suspense>
            </SectionBoundary>
          }
        />
        <Route
          path="/gear"
          element={
            <SectionBoundary label="Gear">
              <Suspense fallback={<Loading />}>
                <GearListPage />
              </Suspense>
            </SectionBoundary>
          }
        />
        <Route
          path="/quote"
          element={
            <SectionBoundary label="Quote">
              <Suspense fallback={<Loading />}>
                <QuotePage />
              </Suspense>
            </SectionBoundary>
          }
        />
        <Route
          path="/contact"
          element={
            <SectionBoundary label="Contact">
              <Suspense fallback={<Loading />}>
                <ContactPage />
              </Suspense>
            </SectionBoundary>
          }
        />
        <Route
          path="*"
          element={
            <div className="p-6">
              Not found.{" "}
              <a className="underline" href="/">
                Go home
              </a>
            </div>
          }
        />
      </Routes>

      <SectionBoundary label="Footer">
        <Suspense fallback={<Loading label="Loading footer…" />}>
          <Footer />
        </Suspense>
      </SectionBoundary>
    </>
  );
}

export default function App() {
  // Keep default scroll-to-top on first mount as well (defensive)
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return <AppInner />;
}
