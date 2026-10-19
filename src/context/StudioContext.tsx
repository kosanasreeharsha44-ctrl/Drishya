import React, { createContext, useContext, useEffect, useState } from 'react';
import type {
  FAQItem,
  IdeaSubmission,
  Inquiry,
  LiveDeliveryStats,
  PortfolioItem,
  Project,
  ProjectTask,
  Review,
  StudioNotification,
  StudioSettings,
  TeamMember,
  UserAccount,
  PushNotificationPayload,
} from '../types/index.ts';
import { calculateIdeaRevenue, calculateProjectProgress } from '../utils/pricing.ts';
import { calculateLiveDeliveryStats, isDeadlineTomorrow } from '../utils/deliveryStats.ts';

// Studio Settings with Patch Requirements
const INITIAL_SETTINGS: StudioSettings = {
  contactEmail: 'unknowneditor910@gmail.com',
  instagramHandle: 'ur_harsha0',
  heroHeadline: 'See your story differently.',
  heroTagline:
    'Drishya is directed by Harsha. We craft high-impact cinematic video edits, color grading, and creative co-creation partnerships.',
  autoReplyTemplate:
    'Hi {NAME},\n\nThank you for reaching out to Drishya! Harsha has received your message regarding {SERVICE}.\n\nWe review all requests within 12–24 hours and will follow up directly on {CONTACT_METHOD} with next steps.\n\nKeep creating,\nHarsha | Founder & Creative Director, Drishya\nInstagram: @ur_harsha0',
  enableTwoFactor: true,
  backupLastRun: new Date().toISOString(),
};

// Default System Users (for testing Owner, Admin, and Team roles)
const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'user-harsha-owner',
    name: 'Harsha (Owner)',
    email: 'unknowneditor910@gmail.com',
    role: 'owner',
    skills: ['Director', 'Color Grading', 'Sound Design'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-admin-1',
    name: 'Content & Project Admin',
    email: 'admin@drishya.studio',
    role: 'admin',
    skills: ['Content Management', 'Client Relations'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-team-1',
    name: 'Associate Video Editor',
    email: 'team@drishya.studio',
    role: 'team',
    skills: ['Rough Cuts', 'Audio Sync'],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How does the Submit Creative Concept & Revenue Share model work?',
    answer:
      'Anyone can pitch a creative concept, script, or digital asset. If Harsha accepts your concept and produces a commercial piece, client work, or digital product from it, you receive an agreed contract share (15%–35% of net revenues). Every payment is tracked transparently in the studio records, and payouts are made directly via UPI or Bank Transfer.',
    category: 'Creative Concepts',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is the typical turnaround time for a project?',
    answer:
      'Turnaround depends on scope and technical requirements. Short-form edits and social creatives are typically completed in 24–48 hours, while complex multi-cam documentary edits or commercial color grading are delivered within 4–7 business days.',
    category: 'Timeline',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How do I share raw footage and large files?',
    answer:
      'We accept footage via Google Drive, Dropbox, WeTransfer, or Frame.io. For creators shooting in log formats (Sony S-Log3, Canon C-Log, Apple ProRes Log, DJI D-Log), our pipeline is fully calibrated for color management and Rec.709 conversion.',
    category: 'Workflow',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'How many revision rounds are included?',
    answer:
      'Every project includes 2 complimentary revision cycles so we can dial in the pacing, music, cuts, and typography to your exact satisfaction.',
    category: 'Revisions',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'Do you use AI in your work?',
    answer:
      'We use modern technical tools for audio cleanup, noise reduction, and roto-scoping, while all final creative storytelling, color timing, pacing, and emotional nuance are handcrafted by Harsha.',
    category: 'Craft',
    order: 5,
  },
];

interface StudioContextType {
  // Settings
  settings: StudioSettings;
  updateSettings: (newSettings: Partial<StudioSettings>) => void;

  // Real-time Delivery Stats (Calculated strictly from real data)
  deliveryStats: LiveDeliveryStats;

  // Current Logged-in User & Role Switcher
  currentUser: UserAccount;
  setCurrentUserRole: (role: 'owner' | 'admin' | 'team') => void;
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'createdAt'>) => void;
  deleteTeamMember: (id: string) => void;

  // Projects (Zero seed data)
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progressPercent'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectTask: (projectId: string, taskId: string) => void;
  addProjectTask: (projectId: string, label: string) => void;
  deleteProjectTask: (projectId: string, taskId: string) => void;
  assignProjectMember: (projectId: string, memberId: string) => void;

  // Inquiries (Zero seed data, no budget field)
  inquiries: Inquiry[];
  submitInquiry: (data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => { success: boolean; inquiry: Inquiry };
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  convertInquiryToProject: (inquiryId: string) => Project | null;
  deleteInquiry: (id: string) => void;

  // Ideas (Zero seed data)
  ideas: IdeaSubmission[];
  submitIdea: (data: Omit<IdeaSubmission, 'id' | 'status' | 'sharePercent' | 'amountEarned' | 'amountOwed' | 'amountPaid' | 'createdAt'>) => { success: boolean; idea: IdeaSubmission };
  updateIdeaStatus: (id: string, status: IdeaSubmission['status']) => void;
  updateIdeaFinancials: (
    id: string,
    amountEarned: number,
    sharePercent: number,
    amountPaid: number,
    payoutNotes?: string
  ) => void;
  deleteIdea: (id: string) => void;

  // Reviews System
  reviews: Review[];
  submitReview: (projectId: string, clientName: string, rating: number, comment: string, service?: string) => { success: boolean; review: Review };
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;

  // Portfolio (Zero seed data)
  portfolio: PortfolioItem[];
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (id: string, updates: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;

  // FAQs (Stored once, reused across site and app)
  faqs: FAQItem[];
  addFaq: (f: Omit<FAQItem, 'id'>) => void;
  updateFaq: (id: string, updates: Partial<FAQItem>) => void;
  deleteFaq: (id: string) => void;

  // Push Notifications & Alerts (Android & Web)
  notifications: StudioNotification[];
  pushAlerts: PushNotificationPayload[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  clearPushAlerts: () => void;

  // Admin Auth
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, pass: string, pin?: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  resetAllDataToDefault: () => void;

  // Review Modal Trigger (from URL query ?review=...)
  activeReviewProjectId: string | null;
  setActiveReviewProjectId: (id: string | null) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: 'drishya_clean_settings_v2',
  PROJECTS: 'drishya_clean_projects_v2',
  INQUIRIES: 'drishya_clean_inquiries_v2',
  IDEAS: 'drishya_clean_ideas_v2',
  PORTFOLIO: 'drishya_clean_portfolio_v2',
  REVIEWS: 'drishya_clean_reviews_v2',
  TEAM: 'drishya_clean_team_v2',
  CURRENT_USER: 'drishya_clean_user_v2',
  FAQS: 'drishya_clean_faqs_v2',
  NOTIFICATIONS: 'drishya_clean_notifications_v2',
  PUSH_ALERTS: 'drishya_clean_push_alerts_v2',
  AUTH: 'drishya_clean_auth_v2',
};

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // BroadcastChannel for cross-tab / real-time synchronization
  const [syncChannel, setSyncChannel] = useState<BroadcastChannel | null>(null);

  useEffect(() => {
    try {
      const channel = new BroadcastChannel('drishya_realtime_sync');
      channel.onmessage = (event) => {
        if (event.data?.type === 'SYNC_DATA') {
          // Trigger local reload of state from updated localStorage
          loadStateFromStorage();
        }
      };
      setSyncChannel(channel);
      return () => channel.close();
    } catch {
      return undefined;
    }
  }, []);

  const broadcastSync = () => {
    if (syncChannel) {
      try {
        syncChannel.postMessage({ type: 'SYNC_DATA', timestamp: Date.now() });
      } catch {}
    }
  };

  // State initialization: STRICT REAL DATA (0 seed projects, 0 seed portfolio, 0 seed inquiries, 0 seed ideas, 0 seed reviews)
  const [settings, setSettings] = useState<StudioSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : { id: 'user-harsha-owner', name: 'Harsha', email: 'unknowneditor910@gmail.com', role: 'owner' };
    } catch {
      return { id: 'user-harsha-owner', name: 'Harsha', email: 'unknowneditor910@gmail.com', role: 'owner' };
    }
  });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAM);
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : []; // Real data only: NO sample projects
    } catch {
      return [];
    }
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : []; // Real data only
    } catch {
      return [];
    }
  });

  const [ideas, setIdeas] = useState<IdeaSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.IDEAS);
      return saved ? JSON.parse(saved) : []; // Real data only
    } catch {
      return [];
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      return saved ? JSON.parse(saved) : []; // Real data only: empty until added by admin
    } catch {
      return [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : []; // Real data only
    } catch {
      return [];
    }
  });

  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      return saved ? JSON.parse(saved) : INITIAL_FAQS;
    } catch {
      return INITIAL_FAQS;
    }
  });

  const [notifications, setNotifications] = useState<StudioNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pushAlerts, setPushAlerts] = useState<PushNotificationPayload[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PUSH_ALERTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [activeReviewProjectId, setActiveReviewProjectId] = useState<string | null>(null);

  // Function to reload storage when updated across tabs
  const loadStateFromStorage = () => {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (p) setProjects(JSON.parse(p));
      const inq = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (inq) setInquiries(JSON.parse(inq));
      const id = localStorage.getItem(STORAGE_KEYS.IDEAS);
      if (id) setIdeas(JSON.parse(id));
      const rev = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      if (rev) setReviews(JSON.parse(rev));
      const port = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (port) setPortfolio(JSON.parse(port));
    } catch {}
  };

  // Check URL for review token on mount (e.g. ?review=<projectId>)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reviewId = params.get('review');
    if (reviewId) {
      setActiveReviewProjectId(reviewId);
    }
  }, []);

  // Save to localStorage and broadcast sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    broadcastSync();
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    broadcastSync();
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    broadcastSync();
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IDEAS, JSON.stringify(ideas));
    broadcastSync();
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(portfolio));
    broadcastSync();
  }, [portfolio]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    broadcastSync();
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(teamMembers));
    broadcastSync();
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PUSH_ALERTS, JSON.stringify(pushAlerts));
  }, [pushAlerts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Real delivery stats (automatically calculated, never typed by hand)
  const deliveryStats = calculateLiveDeliveryStats(projects, reviews);

  // Push Notification Dispatcher
  const emitPushAlert = (category: PushNotificationPayload['category'], title: string, body: string) => {
    const alert: PushNotificationPayload = {
      id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title,
      body,
      category,
      timestamp: new Date().toISOString(),
    };
    setPushAlerts((prev) => [alert, ...prev.slice(0, 24)]);
  };

  // Actions
  const updateSettings = (newSettings: Partial<StudioSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setCurrentUserRole = (role: 'owner' | 'admin' | 'team') => {
    const match = teamMembers.find((m) => m.role === role) || {
      id: `user-${role}`,
      name: role === 'owner' ? 'Harsha (Owner)' : role === 'admin' ? 'Studio Admin' : 'Editor (Team)',
      email: role === 'owner' ? 'unknowneditor910@gmail.com' : `${role}@drishya.studio`,
      role,
    };
    setCurrentUser(match);
  };

  const addTeamMember = (member: Omit<TeamMember, 'id' | 'createdAt'>) => {
    const newMember: TeamMember = {
      ...member,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const deleteTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addProject = (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'progressPercent'>) => {
    const progress = calculateProjectProgress(p.tasks);
    const isCompleted = progress.isAllDone || p.status === 'Completed';
    const deliveredDate = isCompleted ? p.deliveredDate || new Date().toISOString().split('T')[0] : null;

    const newProj: Project = {
      ...p,
      id: `proj-${Date.now()}`,
      startDate: p.startDate || new Date().toISOString().split('T')[0],
      deadline: p.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      deliveredDate,
      progressPercent: progress.percent,
      status: isCompleted ? 'Completed' : p.status,
      assigneeIds: p.assigneeIds || [currentUser.id],
      reviewToken: `rev-${Math.random().toString(36).substring(2, 10)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProj, ...prev]);

    if (newProj.assigneeIds && newProj.assigneeIds.length > 0) {
      emitPushAlert('project_assigned', 'Project Assigned', `You were assigned to "${newProj.title}".`);
    }

    if (isCompleted) {
      emitPushAlert('project_completed', 'Project Completed', `"${newProj.title}" has been delivered.`);
    }

    return newProj;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== id) return proj;
        const tasks = updates.tasks || proj.tasks;
        const progress = calculateProjectProgress(tasks);

        const willBeCompleted =
          updates.status === 'Completed' ||
          (progress.isAllDone && proj.status !== 'Completed');

        // Automatically set deliveredDate upon completion
        const deliveredDate = willBeCompleted
          ? updates.deliveredDate || proj.deliveredDate || new Date().toISOString().split('T')[0]
          : updates.status && updates.status !== 'Completed'
          ? null
          : proj.deliveredDate;

        const updatedStatus = willBeCompleted
          ? 'Completed'
          : updates.status || proj.status;

        if (willBeCompleted && proj.status !== 'Completed') {
          emitPushAlert('project_completed', 'Project Completed & Delivered', `"${proj.title}" has been marked Completed.`);
        }

        return {
          ...proj,
          ...updates,
          tasks,
          progressPercent: progress.percent,
          status: updatedStatus,
          deliveredDate,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleProjectTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newTasks = proj.tasks.map((t) => (t.id === taskId ? { ...t, isDone: !t.isDone } : t));
        const progress = calculateProjectProgress(newTasks);
        const autoCompleted = progress.isAllDone;

        const deliveredDate = autoCompleted
          ? proj.deliveredDate || new Date().toISOString().split('T')[0]
          : proj.deliveredDate;

        return {
          ...proj,
          tasks: newTasks,
          progressPercent: progress.percent,
          status: autoCompleted ? 'Completed' : proj.status === 'Completed' ? 'In Progress' : proj.status,
          deliveredDate: autoCompleted ? deliveredDate : null,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const addProjectTask = (projectId: string, label: string) => {
    if (!label.trim()) return;
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const newTask: ProjectTask = {
          id: `t-${Date.now()}`,
          label: label.trim(),
          isDone: false,
          order: proj.tasks.length + 1,
        };
        const updatedTasks = [...proj.tasks, newTask];
        const progress = calculateProjectProgress(updatedTasks);
        return {
          ...proj,
          tasks: updatedTasks,
          progressPercent: progress.percent,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteProjectTask = (projectId: string, taskId: string) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedTasks = proj.tasks.filter((t) => t.id !== taskId);
        const progress = calculateProjectProgress(updatedTasks);
        return {
          ...proj,
          tasks: updatedTasks,
          progressPercent: progress.percent,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const assignProjectMember = (projectId: string, memberId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const existing = p.assigneeIds || [];
        const updated = existing.includes(memberId)
          ? existing.filter((id) => id !== memberId)
          : [...existing, memberId];
        return { ...p, assigneeIds: updated };
      })
    );
  };

  const submitInquiry = (data: Omit<Inquiry, 'id' | 'status' | 'createdAt'>) => {
    const newInquiry: Inquiry = {
      ...data,
      id: `inq-${Date.now()}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [newInquiry, ...prev]);

    // Format auto-reply email template
    const emailBody = settings.autoReplyTemplate
      .replace('{NAME}', newInquiry.name)
      .replace('{SERVICE}', newInquiry.service.replace('_', ' ').toUpperCase())
      .replace('{CONTACT_METHOD}', newInquiry.phone || newInquiry.email);

    // Push alert
    emitPushAlert('new_inquiry', 'New Client Inquiry Received', `${newInquiry.name} requested details on ${newInquiry.service.replace('_', ' ')}.`);

    const notif: StudioNotification = {
      id: `notif-${Date.now()}`,
      title: `Inquiry from ${newInquiry.name}`,
      message: `${newInquiry.name} submitted a project brief.`,
      type: 'inquiry',
      timestamp: new Date().toISOString(),
      read: false,
      emailPreview: {
        to: newInquiry.email,
        subject: `Thank you for contacting Drishya`,
        body: emailBody,
      },
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, inquiry: newInquiry };
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
  };

  const convertInquiryToProject = (inquiryId: string): Project | null => {
    const inq = inquiries.find((i) => i.id === inquiryId);
    if (!inq) return null;

    const defaultTasks: ProjectTask[] = [
      { id: `t-cv1-${Date.now()}`, label: 'Creative briefing & Asset ingest', isDone: false, order: 1 },
      { id: `t-cv2-${Date.now()}`, label: 'Rough cut assembly & Sound design', isDone: false, order: 2 },
      { id: `t-cv3-${Date.now()}`, label: 'Color grade & Client review', isDone: false, order: 3 },
      { id: `t-cv4-${Date.now()}`, label: 'Final delivery & Master release', isDone: false, order: 4 },
    ];

    const today = new Date().toISOString().split('T')[0];
    const defaultDeadline = inq.deadline || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      clientName: inq.name,
      clientContact: inq.phone ? `${inq.email} / ${inq.phone}` : inq.email,
      service: inq.service,
      title: `${inq.service.replace('_', ' ').toUpperCase()} for ${inq.name}`,
      description: inq.details,
      startDate: today,
      deadline: defaultDeadline,
      deliveredDate: null,
      price: 0,
      paymentStatus: 'Unpaid',
      status: 'Pending',
      progressPercent: 0,
      tasks: defaultTasks,
      assigneeIds: [currentUser.id],
      reviewToken: `rev-${Math.random().toString(36).substring(2, 10)}`,
      notes: `Converted from Inquiry #${inq.id.slice(-5)}. Reference: ${inq.referenceLink || 'None'}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);
    updateInquiryStatus(inquiryId, 'Converted');

    emitPushAlert('project_assigned', 'Inquiry Converted', `New project "${newProject.title}" initialized.`);

    return newProject;
  };

  const deleteInquiry = (id: string) => {
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const submitIdea = (
    data: Omit<
      IdeaSubmission,
      'id' | 'status' | 'sharePercent' | 'amountEarned' | 'amountOwed' | 'amountPaid' | 'createdAt'
    >
  ) => {
    const newIdea: IdeaSubmission = {
      ...data,
      id: `idea-${Date.now()}`,
      status: 'New',
      sharePercent: 20, // Default baseline proposal
      amountEarned: 0,
      amountOwed: 0,
      amountPaid: 0,
      createdAt: new Date().toISOString(),
    };
    setIdeas((prev) => [newIdea, ...prev]);

    emitPushAlert('new_idea', 'New Creative Concept Submitted', `${newIdea.name} submitted concept: "${newIdea.title}".`);

    return { success: true, idea: newIdea };
  };

  const updateIdeaStatus = (id: string, status: IdeaSubmission['status']) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, status } : idea)));
  };

  const updateIdeaFinancials = (
    id: string,
    amountEarned: number,
    sharePercent: number,
    amountPaid: number,
    payoutNotes?: string
  ) => {
    const fin = calculateIdeaRevenue(amountEarned, sharePercent, amountPaid);
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id !== id) return idea;
        return {
          ...idea,
          amountEarned,
          sharePercent,
          amountOwed: fin.amountOwed,
          amountPaid,
          payoutNotes: payoutNotes !== undefined ? payoutNotes : idea.payoutNotes,
          status: idea.status === 'Rejected' ? 'Rejected' : fin.suggestedStatus,
        };
      })
    );
  };

  const deleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  };

  // Review System
  const submitReview = (
    projectId: string,
    clientName: string,
    rating: number,
    comment: string,
    service?: string
  ) => {
    const proj = projects.find((p) => p.id === projectId);
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      projectId,
      projectTitle: proj ? proj.title : 'Creative Project',
      clientName: clientName.trim(),
      rating: Math.min(5, Math.max(1, rating)),
      comment: comment.trim(),
      service: service || (proj ? proj.service : 'video_editing'),
      isApproved: false, // Requires Harsha's approval before public display
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);

    const notif: StudioNotification = {
      id: `notif-rev-${Date.now()}`,
      title: `Client Review Submitted by ${newReview.clientName}`,
      message: `Rated ${newReview.rating}★: "${newReview.comment.substring(0, 40)}..."`,
      type: 'review',
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return { success: true, review: newReview };
  };

  const approveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: !r.isApproved } : r))
    );
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  // Portfolio
  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = { ...item, id: `port-${Date.now()}` };
    setPortfolio((prev) => [newItem, ...prev]);
  };

  const updatePortfolioItem = (id: string, updates: Partial<PortfolioItem>) => {
    setPortfolio((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  // FAQs
  const addFaq = (f: Omit<FAQItem, 'id'>) => {
    const newFaq: FAQItem = { ...f, id: `faq-${Date.now()}` };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const updateFaq = (id: string, updates: Partial<FAQItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Notification management
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const clearPushAlerts = () => {
    setPushAlerts([]);
  };

  // Admin Auth
  const loginAdmin = (email: string, pass: string, pin?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    const isHarsha =
      cleanEmail === 'unknowneditor910@gmail.com' ||
      cleanEmail === 'kosanasreeharsha44@gmail.com';
    const isAdmin = cleanEmail === 'admin@drishya.studio';
    const isTeam = cleanEmail === 'team@drishya.studio';

    const isValidPass =
      cleanPass === 'Harsha@Drishya2026!' ||
      cleanPass === 'drishya2026' ||
      cleanPass === 'editor123';

    if ((isHarsha || isAdmin || isTeam) && isValidPass) {
      if (settings.enableTwoFactor && pin !== undefined) {
        if (pin.trim() !== '123456' && pin.trim() !== '2026') {
          return { success: false, error: 'Invalid 2FA code. (Hint: Try 123456 or 2026)' };
        }
      }

      const assignedRole = isHarsha ? 'owner' : isAdmin ? 'admin' : 'team';
      setCurrentUser({
        id: isHarsha ? 'user-harsha-owner' : isAdmin ? 'user-admin-1' : 'user-team-1',
        name: isHarsha ? 'Harsha (Owner)' : isAdmin ? 'Studio Admin' : 'Editor (Team)',
        email: cleanEmail,
        role: assignedRole,
      });

      setIsAdminLoggedIn(true);
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Use demo email: unknowneditor910@gmail.com and password: Harsha@Drishya2026!',
    };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
  };

  const resetAllDataToDefault = () => {
    setSettings(INITIAL_SETTINGS);
    setProjects([]);
    setInquiries([]);
    setIdeas([]);
    setPortfolio([]);
    setReviews([]);
    setTeamMembers(INITIAL_TEAM);
    setNotifications([]);
    setPushAlerts([]);
  };

  return (
    <StudioContext.Provider
      value={{
        settings,
        updateSettings,
        deliveryStats,
        currentUser,
        setCurrentUserRole,
        teamMembers,
        addTeamMember,
        deleteTeamMember,
        projects,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectTask,
        addProjectTask,
        deleteProjectTask,
        assignProjectMember,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        convertInquiryToProject,
        deleteInquiry,
        ideas,
        submitIdea,
        updateIdeaStatus,
        updateIdeaFinancials,
        deleteIdea,
        reviews,
        submitReview,
        approveReview,
        deleteReview,
        portfolio,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        notifications,
        pushAlerts,
        markNotificationRead,
        clearNotifications,
        clearPushAlerts,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        resetAllDataToDefault,
        activeReviewProjectId,
        setActiveReviewProjectId,
      }}
    >
      {children}
    </StudioContext.Provider>
  );
};

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) {
    throw new Error('useStudio must be used within a StudioProvider');
  }
  return context;
}
