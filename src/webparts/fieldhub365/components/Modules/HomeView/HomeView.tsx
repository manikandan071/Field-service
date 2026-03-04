import * as React from "react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Star,
  Power,
  Activity,
  Trophy,
  Calendar,
} from "lucide-react";

import styles from "./HomeView.module.scss";

import { Web } from "@pnp/sp/presets/all";
import { IActivities } from "../../../config/interface";
import { getTimeAgo } from "../../../config/utils";
import {
  clockIn,
  clockOut,
  getActiveClockRecord,
} from "../../../services/commonService";

interface HomeViewProps {
  onViewAllActivities: () => void;
  onViewTodayJobs: () => void;
  openJobDetails: (jobId: number) => void;
  recentActivities: any[];
}

const HomeView: React.FC<HomeViewProps> = ({
  onViewAllActivities,
  onViewTodayJobs,
  openJobDetails,
  recentActivities,
}) => {
  const spWeb = Web("https://chandrudemo.sharepoint.com/sites/FieldService");

  const [isClockedIn, setIsClockedIn] = useState(true);
  const [clockInOut, setClockInOut] = useState<any>({});
  const [clockInTime, setClockInTime] = useState<Date | null>(
    new Date(new Date().setHours(8, 42, 0)),
  );
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    let interval: number;

    if (isClockedIn && clockInTime) {
      interval = window.setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - clockInTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsed(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isClockedIn, clockInTime]);

  useEffect(() => {
    const initClockStatus = async () => {
      const user = await spWeb.currentUser.get();
      const activeRecord = await getActiveClockRecord(user.Email, spWeb);

      setClockInOut(activeRecord);

      if (activeRecord) {
        setIsClockedIn(true);
        setClockInTime(new Date(activeRecord.fields.StartTime));
      } else {
        setIsClockedIn(false);
      }
    };

    initClockStatus();
  }, []);

  const handleToggleClock = async () => {
    if (clockInOut && clockInOut?.id) {
      await clockOut(spWeb, clockInOut.id);
      setIsClockedIn(false);
      setClockInOut({});
      setClockInTime(null);
    } else {
      await clockIn(spWeb);
      setIsClockedIn(true);
      setClockInTime(new Date());
    }
  };

  return (
    <div className={styles.homeContainer}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.premiumBanner}
      >
        <div className={styles.bannerContent}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={styles.badge}
          >
            <Zap size={10} color="#fde047" fill="currentColor" />
            Duty Active
          </motion.div>

          <h2 className={styles.bannerTitle}>
            Good shift v2,
            <br />
            <span>Henderson.</span>
          </h2>

          <p className={styles.bannerSubtitle}>
            You have 5 high-priority tickets today.
          </p>

          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className={styles.primaryButton}
            onClick={onViewTodayJobs}
          >
            Go to Jobs
            <ArrowRight size={16} />
          </motion.button>
        </div>

        <motion.div
          animate={{ y: [0, -50, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className={styles.bannerImage}
        >
          <img src="https://img.icons8.com/clouds/200/wrench.png" alt="Asset" />
        </motion.div>
      </motion.div>

      <div className={styles.cardsGrid}>
        <motion.div
          whileTap={{ scale: 0.96 }}
          onClick={handleToggleClock}
          className={`${styles.clockCard} ${
            isClockedIn ? styles.on : styles.off
          }`}
        >
          <div className={styles.cardBgIcon}>
            <Activity size={80} />
          </div>
          <div className={styles.clockIcon}>
            <Power size={20} />
          </div>

          {isClockedIn ? (
            <>
              <p className={styles.label}>Session Time</p>
              <p className={styles.time}>{elapsed}</p>
              <p className={styles.hint}>Tap to Finish</p>
            </>
          ) : (
            <>
              <p className={styles.label}>Current Status</p>
              <p className={styles.time}>Off Duty</p>
              <p className={styles.hint}>Tap to Clock In</p>
            </>
          )}
        </motion.div>

        <motion.div whileTap={{ scale: 0.96 }} className={styles.ratingCard}>
          <div className={styles.cardBgIcon}>
            <Trophy size={80} />
          </div>
          <div className={styles.ratingIcon}>
            <Star size={20} fill="currentColor" />
          </div>
          <p className={styles.label}>Net Rating</p>
          <div className={styles.ratingValueRow}>
            <p className={styles.ratingValue}>4.98</p>
            <span className={styles.ratingMax}>/5.0</span>
          </div>
          <p className={styles.hint}>Top 1% Technician</p>
        </motion.div>
      </div>

      <div className={styles.logsSection}>
        <div className={styles.logsHeader}>
          <h3>Recent Logs</h3>
          <button onClick={onViewAllActivities} className={styles.historyBtn}>
            View all <ArrowRight size={14} />
          </button>
        </div>

        <div className={styles.logsList}>
          {recentActivities
            .slice(0, 3)
            .map((activity: IActivities, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.logCard}
                onClick={() => openJobDetails(activity.job)}
              >
                <div
                  className={`${styles.logIcon} ${
                    activity.title === "Job Completed"
                      ? styles.green
                      : styles.blue
                  }`}
                >
                  <CheckCircle2 size={20} />
                </div>

                <div className={styles.logContent}>
                  <div className={styles.logHeader}>
                    <p className={styles.logType}>{activity.title}</p>
                    <div>
                      <Calendar size={10} />
                      {getTimeAgo(activity.created)}
                    </div>
                  </div>
                  <p className={styles.logDescription}>
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      <div className={styles.trustBanner}>
        <div className={styles.trustContent}>
          <div className={styles.trustIcon}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4>Location Privacy Active</h4>
            <p>Tracking only during active shifts</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
