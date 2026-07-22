import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Shield, X, CheckCircle } from "lucide-react";
import { useAdminContributions } from "../../hooks/useAdminContributions";
import ContributionQueue from "../../components/admin/contributions/ContributionQueue";
import AdminContributionDetail from "../../components/admin/contributions/AdminContributionDetail";
import ReviewPanel from "../../components/admin/contributions/ReviewPanel";
import ReviewStats from "../../components/admin/contributions/ReviewStats";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminReviewDashboard() {
  const [selectedId, setSelectedId] = useState(null);

  const [reviewedIds, setReviewedIds] = useState(new Set());

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    sortBy: "createdAt",
  });

  const { data, isLoading, error, isFetching } = useAdminContributions({
    page: 1,
    limit: 12,
    search: searchQuery,
    status: filters.status,
    category: filters.category,
    sortBy: filters.sortBy,
  });

  const contributions = (data?.contributions || []).filter(
    (c) => !reviewedIds.has(c._id),
  );
  const contribution = contributions.find((c) => c._id === selectedId);

  const stats = useMemo(() => {
    const base = contributions || [];
    return {
      pending: base.filter((c) => c.status === "pending").length,
      underReview: base.filter((c) => c.status === "under_review").length,
      approvedToday: base.filter((c) => c.status === "approved").length,
      rejectedToday: base.filter((c) => c.status === "rejected").length,
      needsChanges: base.filter((c) => c.status === "needs_changes").length,
      featured: base.filter((c) => c.isFeatured).length,
      avgReviewTime: "2.4h",
    };
  }, [contributions]);

  const handleSelect = useCallback((contrib) => {
    setSelectedId(contrib._id);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedId(null);
  }, []);

  const handleReviewed = useCallback((id) => {
    setReviewedIds((prev) => new Set([...prev, id]));
    setSelectedId(null);
  }, []);

  useEffect(() => {
    if (!isFetching && data?.contributions) {
      const serverIds = new Set(data.contributions.map((c) => c._id));
      setReviewedIds((prev) => {
        const stillPresent = [...prev].filter((id) => serverIds.has(id));
        return stillPresent.length < prev.size ? new Set(stillPresent) : prev;
      });
    }
  }, [isFetching, data]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 text-center text-red-600">
        <p className="text-sm mb-4">
          {error.message || "Failed to load contributions"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto w-full">
        <ReviewStats stats={stats} />

        <ContributionQueue
          contributions={contributions}
          loading={isLoading}
          onSelect={handleSelect}
          selectedId={selectedId}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
        />

        <AnimatePresence>
          {selectedId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(15, 23, 42, 0.45)",
                backdropFilter: "blur(8px)",
                padding: "1rem",
              }}
              onClick={handleBack}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.15)",
                  width: "100%",
                  maxWidth: "700px",
                  maxHeight: "90vh",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "1.25rem 1.5rem",
                    borderBottom: "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#ffffff",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "1.25rem",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    Review Contribution
                  </h2>
                  <button
                    onClick={handleBack}
                    style={{
                      background: "#f1f5f9",
                      border: "none",
                      borderRadius: "50%",
                      width: "36px",
                      height: "36px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#e2e8f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f5f9")}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div
                  style={{
                    padding: "1.5rem",
                    overflowY: "auto",
                  }}
                >
                  <AdminContributionDetail
                    contributionId={selectedId}
                    onBack={handleBack}
                  />
                  {contribution && (
                    <div
                      style={{
                        overflowX: "hidden",
                        paddingTop: "0.5rem",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <ReviewPanel
                        contribution={contribution}
                        onClose={handleBack}
                        onReviewed={handleReviewed}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
