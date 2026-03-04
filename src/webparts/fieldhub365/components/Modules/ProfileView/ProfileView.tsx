import * as React from "react";
import { useEffect, useState } from "react";
import {
  Settings,
  Mail,
  Phone,
  MapPin,
  Award,
  Shield,
  UserCheck,
  Star,
  Zap,
  Globe,
  Clock,
  Box,
} from "lucide-react";

import styles from "./ProfileView.module.scss";
import { Web } from "@pnp/sp/presets/all";

interface ProfileViewProps {
  employeeDetails: any;
}

const ProfileView: React.FC<ProfileViewProps> = ({ employeeDetails }) => {
  const spWeb = Web("https://chandrudemo.sharepoint.com/sites/FieldService");
  const [profileImage, setProfileImage] = useState<string>("");

  useEffect(() => {
    (async () => {
      const user = await spWeb.currentUser.get();
      setProfileImage(user.Email);
    })();
  }, [employeeDetails]);

  return (
    <div className={styles.profileContainer}>
      <div>
        <div className={styles.settingsBtn}>
          <button>
            <Settings size={22} />
          </button>
        </div>

        <div className={styles.avatarWrapper}>
          <div className={styles.avatar}>
            <img src={profileImage} alt="Avatar" />
          </div>
          <div className={styles.statusIndicator} />
        </div>

        <h2>{employeeDetails?.employee}</h2>
        <div className={styles.roleBadge}>{employeeDetails?.role}</div>

        <div className={styles.miniBadges}>
          <MiniBadge
            icon={<Star size={14} fill="currentColor" />}
            label="Avg Star"
            value="4.9"
            color="amber"
          />
          <MiniBadge
            icon={<Zap size={14} fill="currentColor" />}
            label="Activity"
            value="High"
            color="indigo"
          />
          <MiniBadge
            icon={<Award size={14} />}
            label="Level"
            value="Gold"
            color="purple"
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Global Impact</h3>
          <Globe size={18} color="#cbd5e1" />
        </div>

        <div className={styles.impactGrid}>
          <ImpactTile
            label="Jobs Closed"
            value="1.2k"
            trend="+5%"
            icon={<Box size={18} />}
          />
          <ImpactTile
            label="Speed Index"
            value="42m"
            trend="-2m"
            icon={<Clock size={18} />}
          />
          <ImpactTile
            label="Trust Score"
            value="99%"
            trend="+1%"
            icon={<Shield size={18} />}
          />
          <ImpactTile
            label="Referrals"
            value="242"
            trend="+12"
            icon={<UserCheck size={18} />}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Skillsets</h3>
        </div>
        <div className={styles.skills}>
          {employeeDetails?.skillSets?.map((skill: any, idx: number) => (
            <span key={idx} className={styles.skillPill}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Others</h3>
        </div>
        <div className={styles.infoCard}>
          <InfoRow
            icon={<Mail size={18} color="#cbd5e1" />}
            label="Email"
            value={employeeDetails?.contactEmail}
          />
          <InfoRow
            icon={<Phone size={18} color="#cbd5e1" />}
            label="Phone"
            value={employeeDetails?.contactNo}
          />
          <InfoRow
            icon={<MapPin size={18} color="#cbd5e1" />}
            label="Location"
            value={employeeDetails?.city}
          />
        </div>
      </div>
    </div>
  );
};

const MiniBadge: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className={`mini-badge ${color}`}>
    <div className="mini-icon">{icon}</div>
    <p className="mini-value">{value}</p>
    <p className="mini-label">{label}</p>
  </div>
);

const ImpactTile: React.FC<{
  label: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
}> = ({ label, value, trend, icon }) => (
  <div className="impact-tile">
    <div className="impact-icon">{icon}</div>
    <p className="impact-label">{label}</p>
    <div className="impact-bottom">
      <h4>{value}</h4>
      {trend && <span className="trend">{trend}</span>}
    </div>
  </div>
);

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="info-row">
    <div className="info-icon">{icon}</div>
    <div className="info-content">
      <p className="info-label">{label}</p>
      <p className="info-value">{value}</p>
    </div>
    {/* <ChevronRight size={16} /> */}
  </div>
);

export default ProfileView;
