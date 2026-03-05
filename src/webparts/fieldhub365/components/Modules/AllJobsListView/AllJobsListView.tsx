/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState } from "react";
import {
  Search,
  MapPin,
  ChevronRight,
  SlidersHorizontal,
  Clock,
  CheckCircle,
  Hourglass,
  AlertCircle,
} from "lucide-react";
import styles from "./AllJobsListView.module.scss";
import { Job, JobStatus } from "../../../config/interface";

interface AllJobsListViewProps {
  allJobs: Job[];
  onJobClick: (job: Job) => void;
}

const AllJobsListView: React.FC<AllJobsListViewProps> = ({
  allJobs,
  onJobClick,
}) => {
  const [query, setQuery] = useState<string>("");
  const [filtered, setFiltered] = useState<Job[]>([]);

  //   const filtered: Job[] = allJobs?.filter((j: Job) =>
  //     j.title.toLowerCase().includes(query.toLowerCase()),
  //         );

  const onFilterFunction = (value: string) => {
    setQuery(value);
    setFiltered(
      allJobs?.filter((j: Job) =>
        j.title.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  React.useEffect(() => {
    if (allJobs.length > 0) {
      setFiltered([...allJobs]);
    }
  }, [allJobs]);

  return (
    <div className={styles.jobsContainer}>
      {/* Search Section */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <Search className={styles.searchIcon} size={20} />

          <input
            value={query}
            onChange={(e) => onFilterFunction(e.target.value)}
            placeholder="Search full registry..."
            className={styles.searchInput}
          />

          <button className={styles.filterBtn}>
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Tags */}
        <div className={styles.tagsContainer}>
          {[
            "Not Started",
            "In Progress",
            "Completed",
            "High",
            "Medium",
            "Low",
          ].map((tag) => (
            <button key={tag} className={styles.tagBtn}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className={styles.resultsSection}>
        <h3 className={styles.resultsTitle}>Results ({filtered.length})</h3>

        {filtered.map((job: Job, idx: number) => {
          const priorityClass =
            job.priority === "High"
              ? styles.priorityHigh
              : job.priority === "Medium"
                ? styles.priorityMedium
                : styles.priorityLow;

          const statusClass =
            job.status === JobStatus.COMPLETED
              ? styles.completed
              : job.status === JobStatus.IN_PROGRESS
                ? styles.inProgress
                : styles.pending;

          return (
            <div
              key={idx}
              className={styles.jobCard}
              onClick={() => onJobClick(job)}
            >
              <div className={`${styles.jobIcon} ${statusClass}`}>
                {job.status === "Completed" ? (
                  <CheckCircle size={20} />
                ) : job.status === "In Progress" ? (
                  <Hourglass size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
              </div>

              <div className={styles.jobInfo}>
                <div className={styles.jobTop}>
                  <span className={styles.jobId}>J000{job.id}</span>
                  <span className={`${styles.priorityBadge} ${priorityClass}`}>
                    {job.priority}
                  </span>
                </div>

                <h4 className={styles.jobTitle}>{job.title}</h4>

                <div className={styles.jobMeta}>
                  <span>
                    <MapPin size={12} /> {job.customer}
                  </span>
                  <span>
                    <Clock size={12} /> {job.time}
                  </span>
                </div>
              </div>

              <ChevronRight className={styles.chevron} size={20} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllJobsListView;
