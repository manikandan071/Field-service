export interface IActivities {
  id: number;
  title: string;
  description: string;
  job: number;
  created: string;
}

export enum JobStatus {
  NOT_STARTED = "Not Started",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

export interface Job {
  id: string;
  title: string;
  customer: string;
  address: string;
  time: string;
  status: JobStatus;
  priority: "High" | "Medium" | "Low";
  startDate: string;
  endDate: string;
  customerRating: number;
  customerFeedback: string;
  customerId: string;
  firstName: string;
  lastName: string;
  city: string;
  contactNo: string;
  contactEmail: string;
  address1: string;
  address2: string;
}

export interface Activity {
  id: string;
  type: string;
  description: string;
  time: string;
}

export interface PerformanceStats {
  period: string;
  completed: number;
  rating: number;
}
