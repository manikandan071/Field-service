/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import { useState, useRef, useEffect, SetStateAction, Dispatch } from "react";
import {
  Info,
  //   MessageSquare,
  Paperclip,
  PenTool,
  MapPin,
  Phone,
  //   Calendar,
  CheckCircle,
  Clock,
  PlayCircle,
  Send,
  Sparkles,
  Camera,
  Upload,
  Trash2,
  ShieldCheck,
  X,
  User,
} from "lucide-react";
// import { GoogleGenAI } from "@google/genai";
import "./TaskDetailView.css";
import { useParams } from "react-router-dom";
import { Job, JobStatus } from "../../../config/interface";

interface JobsDetailsProps {
  allJobs: Job[];
}

const TaskDetailView: React.FC<JobsDetailsProps> = ({ allJobs }) => {
  const [activeTab, setActiveTab] = useState<
    "details" | "ai" | "attachments" | "signature"
  >("details");

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const { jobId } = useParams();
  console.log("Current jobId from URL:", jobId);

  useEffect(() => {
    console.log("allJobs", allJobs);

    if (jobId) {
      const job = allJobs.find((j) => Number(j.id) === Number(jobId));
      console.log("job", job);
      setSelectedJob(job || null);
    }
  }, [jobId || allJobs]);

  if (!selectedJob) return null;

  const statusClass =
    selectedJob.status === JobStatus.COMPLETED
      ? "completed"
      : selectedJob.status === JobStatus.IN_PROGRESS
        ? "in_progress"
        : "pending";

  return (
    <div className="task-detail-container">
      {/* Premium Job Header */}
      <div className="job-header">
        <div className="header-top">
          <div className="job-id-status">
            <span className="detail-job-id">J000{selectedJob.id}</span>
            <div className={`status-badge ${statusClass}`}>
              {selectedJob.status === JobStatus.COMPLETED ? (
                <CheckCircle size={16} />
              ) : selectedJob.status === JobStatus.IN_PROGRESS ? (
                <PlayCircle size={16} />
              ) : (
                <Clock size={16} />
              )}
              <span className="status-text">{selectedJob.status}</span>
            </div>
          </div>
          <div>
            <h2 className="task-detail-job-title">{selectedJob.title}</h2>
          </div>
        </div>

        <div className="priority-container">
          <div
            className={`priority-badge ${selectedJob.priority === "High" ? "high" : "normal"}`}
          >
            {selectedJob.priority} Priority
          </div>
          <div className="time-badge">
            <Clock size={12} /> {selectedJob.time}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-nav-wrapper">
        <div className="tab-nav-container">
          <TabButton
            active={activeTab === "details"}
            onClick={() => setActiveTab("details")}
            icon={<Info size={16} />}
            label="Info"
          />
          <TabButton
            active={activeTab === "ai"}
            onClick={() => setActiveTab("ai")}
            icon={<Sparkles size={16} />}
            label="AI Hub"
          />
          <TabButton
            active={activeTab === "attachments"}
            onClick={() => setActiveTab("attachments")}
            icon={<Paperclip size={16} />}
            label="Media"
          />
          <TabButton
            active={activeTab === "signature"}
            onClick={() => setActiveTab("signature")}
            icon={<PenTool size={16} />}
            label="Sign"
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="job-tab-content">
        <div>
          {activeTab === "details" && (
            <DetailsTab key="details" job={selectedJob} />
          )}
          {activeTab === "ai" && <AIChatTab key="ai" job={selectedJob} />}
          {activeTab === "attachments" && <AttachmentsTab key="attachments" />}
          {activeTab === "signature" && <SignatureTab key="signature" />}
        </div>
      </div>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button onClick={onClick} className={`tab-button ${active ? "active" : ""}`}>
    {icon}
    <span className="tab-label">{label}</span>
  </button>
);

interface DetailsTabProps {
  job: Job;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ job }) => (
  <div className="details-tab">
    <div className="details-card">
      <h3 className="card-title">Client Contact</h3>
      <DetailItem
        icon={<User size={18} className="detail-icon" />}
        label="Full Name"
        value={job.customer}
      />
      <DetailItem
        icon={<Phone size={18} className="detail-icon" />}
        label="Primary Phone"
        value={job.contactNo}
      />
      <DetailItem
        icon={<MapPin size={18} className="detail-icon" />}
        label="Service Address"
        value={job.address}
      />
    </div>

    <div className="details-card">
      <h3 className="card-title">Job Specifications</h3>
      <DetailItem
        icon={<Clock size={18} className="detail-icon" />}
        label="Time Slot"
        value={job.time}
      />
      <DetailItem
        icon={<ShieldCheck size={18} className="detail-icon" />}
        label="Warranty Status"
        value="Active (Valid until 2026)"
      />
      <div className="notes-section">
        <p className="notes-label">Technician Notes</p>
        <p className="notes-content">
          Ensure filter unit is calibrated for high efficiency. Previous
          technician noted slight wear on the primary gasket. Spare parts are
          located in van inventory under bin B-12.
        </p>
      </div>
    </div>
  </div>
);

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon, label, value }) => (
  <div className="detail-item">
    <div className="detail-icon-wrapper">{icon}</div>
    <div className="detail-content">
      <p className="detail-label">{label}</p>
      <p className="detail-value">{value}</p>
    </div>
  </div>
);

interface AIChatTabProps {
  job: Job;
}

const AIChatTab: React.FC<AIChatTabProps> = ({ job }) => {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: `Hi Alex! I've analyzed Work Order ${job.id}. How can I assist you with this maintenance task today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    try {
      //   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      //   const response = await ai.models.generateContent({
      //     model: "gemini-3-flash-preview",
      //     contents: `Context: You are a technical AI assistant for a field service management app.
      //       The technician is working on: ${job.title} for ${job.customer} at ${job.address}.
      //       Current Status: ${job.status}.
      //       Technician question: ${userText}`,
      //     config: { temperature: 0.7 },
      //   });
      const response = {
        text: "Based on the work order details, I recommend starting with the installation guide for the new filter unit. Make sure to check the calibration settings and compare them with the specifications in the manual. If you encounter any issues during installation, I can provide troubleshooting steps or connect you with a live support agent.",
      };
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            response.text ||
            "I'm having trouble connecting to my service manual. Please try again.",
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Service error. Please check your connection." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    "Installation guide",
    "Troubleshooting steps",
    "Safety protocols",
  ];

  return (
    <div className="ai-chat-container">
      <div className="chat-header">
        <Sparkles size={16} className="chat-header-icon" />
        <span className="chat-header-title">Co-Pilot Technical Support</span>
      </div>

      <div ref={scrollRef} className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`message-wrapper ${m.role}`}>
            <div className={`message-bubble ${m.role}`}>{m.text}</div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <div className="typing-bubble">
              <span className="typing-dot"></span>
              <span className="typing-dot delay-100"></span>
              <span className="typing-dot delay-200"></span>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input-container">
        <div className="suggestions-container">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setInput(s)}
              className="suggestion-button"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI technical details..."
            className="chat-input-field"
          />
          <button onClick={handleSend} className="send-button">
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface PhotoSectionProps {
  title: string;
  photos: string[];
  setPhotos: Dispatch<SetStateAction<string[]>>;
}

const AttachmentsTab: React.FC = () => {
  const [beforePhotos, setBeforePhotos] = useState<string[]>([]);
  const [afterPhotos, setAfterPhotos] = useState<string[]>([]);

  const PhotoSection: React.FC<PhotoSectionProps> = ({
    title,
    photos,
    setPhotos,
  }) => (
    <div className="photo-section">
      <div className="photo-header">
        <h3 className="photo-title">{title} Photos</h3>
        <span className="photo-count">{photos.length} Captured</span>
      </div>

      <div className="photo-grid">
        {photos.map((p, i) => (
          <div key={i} className="photo-item">
            <img
              src={p}
              alt={`${title} photo ${i + 1}`}
              className="photo-image"
            />
            <button
              onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
              className="delete-photo-btn"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setPhotos([
              ...photos,
              `https://picsum.photos/400/400?random=${Math.random()}`,
            ])
          }
          className="add-photo-btn"
        >
          <Camera size={20} />
          <span className="add-photo-text">Snap</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="attachments-tab">
      <PhotoSection
        title="Before Work"
        photos={beforePhotos}
        setPhotos={setBeforePhotos}
      />
      <PhotoSection
        title="After Completion"
        photos={afterPhotos}
        setPhotos={setAfterPhotos}
      />

      <div className="action-buttons">
        <button className="cancel-btn">Cancel</button>
        <button className="submit-btn">
          <Upload size={14} /> Submit Media
        </button>
      </div>
    </div>
  );
};

const SignatureTab: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    canvasRef.current?.getContext("2d")?.beginPath();
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#242424";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="signature-tab">
      <div className="signature-card">
        <h3 className="signature-title">Customer Confirmation</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="signature-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="canvas-overlay">
            <div className="signature-line"></div>
            <span className="signature-placeholder">X Sign Above</span>
          </div>
          <button onClick={clear} className="clear-canvas-btn">
            <X size={16} />
          </button>
        </div>

        <p className="signature-disclaimer">
          By signing, you confirm that the service was performed to your
          satisfaction and according to company policy.
        </p>
      </div>

      <div className="signature-actions">
        <button onClick={clear} className="reset-btn">
          Reset Pad
        </button>
        <button className="confirm-btn">Complete Job</button>
      </div>
    </div>
  );
};

export default TaskDetailView;
