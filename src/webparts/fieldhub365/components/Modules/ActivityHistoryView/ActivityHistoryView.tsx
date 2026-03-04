import * as React from "react";
import { FileText, Filter, Calendar, CheckCircle2 } from "lucide-react";
import styles from "./ActivityHistoryView.module.scss";
import { IActivities } from "../../../config/interface";
import { getTimeAgo } from "../../../config/utils";

interface ActivityHistoryViewProps {
  openJobDetails: (jobId: number) => void;
  recentActivities: IActivities[];
}

const ActivityHistoryView: React.FC<ActivityHistoryViewProps> = ({
  recentActivities,
  openJobDetails,
}) => {
  return (
    <div className={styles["activity-container"]}>
      {/* Header */}
      <div className={styles["activity-header"]}>
        <div>
          <h2 className={styles["activity-title"]}>Activity Stream</h2>
          <p className={styles["activity-subtitle"]}>
            Logged events for this cycle
          </p>
        </div>

        <button className={styles["filter-button"]}>
          <Filter size={20} />
        </button>
      </div>

      {/* Timeline */}
      <div className={styles.timeline}>
        {recentActivities?.map((activity: IActivities, idx: number) => (
          <div
            key={`${activity.id}-${idx}`}
            className={styles["timeline-item"]}
            onClick={() => openJobDetails(activity.job)}
          >
            <div className={styles["timeline-dot"]}>
              <CheckCircle2 size={18} color="#16a34a" />
            </div>

            <div className={styles["activity-card"]}>
              <div className={styles["card-header"]}>
                <span className={styles["activity-type"]}>
                  {activity.title}
                </span>

                <div className={styles["activity-time"]}>
                  <Calendar size={10} />
                  {getTimeAgo(activity.created)}
                </div>
              </div>

              <p className={styles["activity-description"]}>
                {activity.description}
              </p>

              <button className={styles["audit-button"]}>
                <FileText size={12} />
                Detailed Audit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHistoryView;
