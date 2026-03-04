import * as React from "react";
import { useEffect, useState } from "react";
import {
  Home,
  ClipboardList,
  TrendingUp,
  User,
  Bell,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import styles from "./MobileLayout.module.scss";

import { Web } from "@pnp/sp/webs";
import {
  getEmployeeDetails,
  getjobsDetails,
} from "../../services/commonService";
import { IActivities, Job } from "../../config/interface";
import HomeView from "../Modules/HomeView/HomeView";
import ProfileView from "../Modules/ProfileView/ProfileView";
import JobsView from "../Modules/JobsView/JobsView";
import AllJobsListView from "../Modules/AllJobsListView/AllJobsListView";
import PerformanceView from "../Modules/PerformanceView/PerformanceView";
import ActivityHistoryView from "../Modules/ActivityHistoryView/ActivityHistoryView";
import TaskDetailView from "../Modules/TaskDetailView/TaskDetailView";

interface MobileLayoutProps {
  SpContext: any;
  graphContext: any;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  SpContext,
  graphContext,
}: MobileLayoutProps) => {
  console.log(SpContext, graphContext);

  const spWeb = Web("https://chandrudemo.sharepoint.com/sites/FieldService");

  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [recentActivities, setRecentActivities] = useState<IActivities[]>([]);
  const [employeeDetails, setEmployeeDetails] = useState<any>([]);

  const usePageMeta = () => {
    const location = useLocation();

    if (location.pathname.startsWith("/home/activity-history")) {
      return { title: "Logs", isSubView: true };
    }
    if (location.pathname.startsWith("/jobs/all")) {
      return { title: "All Jobs", isSubView: true };
    }
    if (location.pathname.startsWith("/jobs/")) {
      return { title: "Task Details", isSubView: true };
    }

    return {
      title: (
        <>
          Field <span>Service</span>
        </>
      ),
      isSubView: false,
    };
  };

  const navigate = useNavigate();
  const location = useLocation();
  const { title, isSubView } = usePageMeta();

  const activeTab = location.pathname.startsWith("/jobs")
    ? "jobs"
    : location.pathname.startsWith("/performance")
      ? "performance"
      : location.pathname.startsWith("/profile")
        ? "profile"
        : "home";

  useEffect(() => {
    (async () => {
      const user = await spWeb.currentUser.get();
      getEmployeeDetails(setEmployeeDetails, spWeb, user.Email);
      getjobsDetails(spWeb, setAllJobs);
      setRecentActivities([]);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const user = await spWeb.currentUser.get();
      console.log(user);
    })();
  }, []);

  const openJobDetails = (jobId: number) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.topNav}>
        <div className={styles.navInner}>
          {isSubView ? (
            <div className={styles.headerLeft}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
                className={styles.backButton}
              >
                <ArrowLeft size={24} />
              </motion.button>
              <h1 className={styles.appTitle}>{title}</h1>
            </div>
          ) : (
            <div className={styles.tabWrapper}>
              <NavButton
                active={activeTab === "home"}
                onClick={() => navigate("/home")}
                icon={<Home size={20} />}
                label="Home"
              />
              <NavButton
                active={activeTab === "jobs"}
                onClick={() => navigate("/jobs")}
                icon={<ClipboardList size={20} />}
                label="Jobs"
              />
              <NavButton
                active={activeTab === "performance"}
                onClick={() => navigate("/performance")}
                icon={<TrendingUp size={20} />}
                label="Stats"
              />
              <NavButton
                active={activeTab === "profile"}
                onClick={() => navigate("/profile")}
                icon={<User size={20} />}
                label="Me"
              />
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            className={styles.notificationButton}
          >
            <Bell size={18} />
            <span className={styles.notificationDot}></span>
          </motion.button>
        </div>
      </nav>

      <main className={styles.appMain}>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />

          <Route
            path="/home"
            element={
              <HomeView
                onViewAllActivities={() => navigate("/home/activity-history")}
                onViewTodayJobs={() => navigate("/jobs")}
                openJobDetails={openJobDetails}
                recentActivities={recentActivities}
              />
            }
          />

          <Route
            path="/home/activity-history"
            element={
              <ActivityHistoryView
                recentActivities={recentActivities}
                openJobDetails={openJobDetails}
              />
            }
          />

          <Route
            path="/jobs"
            element={
              <JobsView
                allJobs={allJobs}
                onJobClick={(job: Job) => navigate(`/jobs/${job.id}`)}
                onViewAllJobs={() => navigate("/jobs/all")}
              />
            }
          />

          <Route
            path="/jobs/all"
            element={
              <AllJobsListView
                allJobs={allJobs}
                onJobClick={(job: Job) => navigate(`/jobs/${job.id}`)}
              />
            }
          />

          <Route
            path="/jobs/:jobId"
            element={<TaskDetailView allJobs={allJobs} />}
          />

          <Route path="/performance" element={<PerformanceView />} />

          <Route
            path="/profile"
            element={<ProfileView employeeDetails={employeeDetails[0]} />}
          />
        </Routes>
      </main>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  icon: React.ReactElement;
  label: string;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({
  active,
  icon,
  label,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`${styles.navItem} ${active ? styles.active : ""}`}
  >
    <div className={`${styles.navIcon} ${active ? styles.active : ""}`}>
      {React.cloneElement(icon, {
        strokeWidth: active ? 2.5 : 2,
      } as any)}
    </div>

    {active && <span className={styles.navLabel}>{label}</span>}
  </button>
);

export default MobileLayout;
