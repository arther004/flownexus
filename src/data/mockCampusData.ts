/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Announcement, TimetableSlot, SmartClassroom, Assignment, CampusEvent, Appointment, CampusUser, LoginAuditLog } from '../types/campus';

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Midterm Examination Schedule & Room Allocations Released',
    content: 'The Spring 2026 midterm examination schedule has been officially published. Please verify your course codes and assigned examination halls in Turing Hall and Lovelace Center. Students requiring accommodations must submit paperwork by Friday.',
    category: 'academic',
    isUrgent: true,
    publishedAt: '2026-09-28T08:30:00Z',
    authorName: 'Office of Academic Registrar',
    authorRole: 'Registrar',
    department: 'Academic Affairs'
  },
  {
    id: 'ann-2',
    title: 'Campus High-Performance Computing Cluster Maintenance Window',
    content: 'Scheduled maintenance on the Ada Cluster will occur this Saturday from 02:00 to 06:00 UTC. Compute jobs scheduled during this window will be queued automatically. JupyterHub and GPU nodes will resume regular scheduling immediately afterward.',
    category: 'campus',
    isUrgent: false,
    publishedAt: '2026-09-27T14:15:00Z',
    authorName: 'Dr. Michael Vance',
    authorRole: 'Head of Research Computing',
    department: 'Information Technology'
  },
  {
    id: 'ann-3',
    title: 'Annual Quantum & AI Research Symposium 2026 Open for Submissions',
    content: 'Undergraduate and graduate researchers are invited to submit poster abstracts for the upcoming symposium. Selected abstracts will be published in the university digital proceedings and qualify for department travel grants.',
    category: 'academic',
    isUrgent: false,
    publishedAt: '2026-09-26T10:00:00Z',
    authorName: 'Prof. Elena Rostova',
    authorRole: 'Faculty Chair',
    department: 'School of Computing'
  },
  {
    id: 'ann-4',
    title: 'Fall Career & Internship Fair: 85+ Tech Employers Attending',
    content: 'Student registration is now open for the campus-wide career fair in the University Grand Atrium. Bring digital copies of your resume. Resume review clinics will run all week in Newton Hall 204.',
    category: 'career',
    isUrgent: false,
    publishedAt: '2026-09-25T11:45:00Z',
    authorName: 'Career Development Center',
    authorRole: 'Director of Industry Relations',
    department: 'Student Affairs'
  }
];

export const initialTimetable: TimetableSlot[] = [
  {
    id: 'time-1',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Architecture',
    instructor: 'Prof. David K. Sterling',
    dayOfWeek: 'Monday',
    startTime: '09:00',
    endTime: '10:30',
    roomId: 'room-101',
    roomName: 'Turing Auditorium 101',
    building: 'Turing Hall',
    type: 'lecture',
    credits: 4
  },
  {
    id: 'time-2',
    courseCode: 'CS-442',
    courseName: 'Machine Learning & Neural Representations',
    instructor: 'Dr. Priya Ramanujan',
    dayOfWeek: 'Monday',
    startTime: '11:00',
    endTime: '12:30',
    roomId: 'room-202',
    roomName: 'Lovelace Lab 202',
    building: 'Ada Lovelace Center',
    type: 'lab',
    credits: 4
  },
  {
    id: 'time-3',
    courseCode: 'EE-310',
    courseName: 'Embedded IoT Systems & Edge Computing',
    instructor: 'Dr. Marcus Vance',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '11:30',
    roomId: 'room-305',
    roomName: 'Newton Hardware Studio 305',
    building: 'Newton Complex',
    type: 'lecture',
    credits: 3
  },
  {
    id: 'time-4',
    courseCode: 'CS-485',
    courseName: 'Database Internals & Storage Engines',
    instructor: 'Prof. Sarah Jenkins',
    dayOfWeek: 'Wednesday',
    startTime: '13:00',
    endTime: '14:30',
    roomId: 'room-101',
    roomName: 'Turing Auditorium 101',
    building: 'Turing Hall',
    type: 'lecture',
    credits: 4
  },
  {
    id: 'time-5',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems Lab: Raft Consensus',
    instructor: 'Prof. David K. Sterling',
    dayOfWeek: 'Wednesday',
    startTime: '15:00',
    endTime: '17:00',
    roomId: 'room-202',
    roomName: 'Lovelace Lab 202',
    building: 'Ada Lovelace Center',
    type: 'lab',
    credits: 4
  },
  {
    id: 'time-6',
    courseCode: 'HUM-220',
    courseName: 'Ethics in Artificial Intelligence & Digital Governance',
    instructor: 'Dr. Jonathan Miller',
    dayOfWeek: 'Thursday',
    startTime: '09:30',
    endTime: '11:00',
    roomId: 'room-104',
    roomName: 'Turing Seminar Suite 104',
    building: 'Turing Hall',
    type: 'seminar',
    credits: 3
  },
  {
    id: 'time-7',
    courseCode: 'CS-442',
    courseName: 'Deep Learning Workshop: Diffusion Models',
    instructor: 'Dr. Priya Ramanujan',
    dayOfWeek: 'Friday',
    startTime: '14:00',
    endTime: '16:00',
    roomId: 'room-205',
    roomName: 'Lovelace GPU Cluster Room 205',
    building: 'Ada Lovelace Center',
    type: 'lab',
    credits: 4
  }
];

export const initialClassrooms: SmartClassroom[] = [
  {
    id: 'room-101',
    name: 'Turing Auditorium 101',
    code: 'TUR-101',
    building: 'Turing Hall',
    floor: 1,
    capacity: 120,
    currentOccupancy: 84,
    temperatureCelsius: 21.5,
    airQualityAqi: 28,
    noiseLevelDb: 42,
    hasProjector: true,
    hasLectureRecording: true,
    hasGpuWorkstations: false,
    status: 'occupied'
  },
  {
    id: 'room-104',
    name: 'Turing Seminar Suite 104',
    code: 'TUR-104',
    building: 'Turing Hall',
    floor: 1,
    capacity: 35,
    currentOccupancy: 0,
    temperatureCelsius: 20.8,
    airQualityAqi: 22,
    noiseLevelDb: 29,
    hasProjector: true,
    hasLectureRecording: true,
    hasGpuWorkstations: false,
    status: 'available'
  },
  {
    id: 'room-202',
    name: 'Lovelace Lab 202',
    code: 'LOV-202',
    building: 'Ada Lovelace Center',
    floor: 2,
    capacity: 45,
    currentOccupancy: 38,
    temperatureCelsius: 22.1,
    airQualityAqi: 34,
    noiseLevelDb: 58,
    hasProjector: true,
    hasLectureRecording: true,
    hasGpuWorkstations: true,
    status: 'occupied'
  },
  {
    id: 'room-205',
    name: 'Lovelace GPU Cluster Room 205',
    code: 'LOV-205',
    building: 'Ada Lovelace Center',
    floor: 2,
    capacity: 30,
    currentOccupancy: 12,
    temperatureCelsius: 19.5,
    airQualityAqi: 18,
    noiseLevelDb: 64,
    hasProjector: true,
    hasLectureRecording: true,
    hasGpuWorkstations: true,
    status: 'available'
  },
  {
    id: 'room-305',
    name: 'Newton Hardware Studio 305',
    code: 'NEW-305',
    building: 'Newton Complex',
    floor: 3,
    capacity: 40,
    currentOccupancy: 0,
    temperatureCelsius: 21.0,
    airQualityAqi: 25,
    noiseLevelDb: 31,
    hasProjector: true,
    hasLectureRecording: false,
    hasGpuWorkstations: false,
    status: 'available'
  },
  {
    id: 'room-312',
    name: 'Newton Collaborative Think Tank 312',
    code: 'NEW-312',
    building: 'Newton Complex',
    floor: 3,
    capacity: 20,
    currentOccupancy: 18,
    temperatureCelsius: 22.8,
    airQualityAqi: 41,
    noiseLevelDb: 51,
    hasProjector: true,
    hasLectureRecording: true,
    hasGpuWorkstations: false,
    status: 'reserved'
  }
];

export const initialAssignments: Assignment[] = [
  {
    id: 'asg-1',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Architecture',
    title: 'Lab 3: Implementing Multi-Node Raft Leader Election',
    description: 'Construct a fault-tolerant leader election and log replication prototype in TypeScript or Go. Must pass the partition recovery test harness with 5 nodes.',
    dueDate: '2026-10-02T23:59:00Z',
    totalPoints: 100,
    status: 'pending'
  },
  {
    id: 'asg-2',
    courseCode: 'CS-442',
    courseName: 'Machine Learning & Neural Representations',
    title: 'Project 2: Attention Mechanism & Transformer Implementation',
    description: 'Train a miniature decoder-only language model from scratch on Shakespeare text. Report cross-entropy loss curves and generation samples.',
    dueDate: '2026-10-05T23:59:00Z',
    totalPoints: 100,
    status: 'pending'
  },
  {
    id: 'asg-3',
    courseCode: 'CS-485',
    courseName: 'Database Internals & Storage Engines',
    title: 'Assignment 1: B+ Tree Indexing Engine & Buffer Pool Manager',
    description: 'Implement a page-based B+ Tree storage manager with lock crabbing support for concurrent reads.',
    dueDate: '2026-09-24T23:59:00Z',
    totalPoints: 100,
    status: 'graded',
    grade: 96,
    feedback: 'Excellent concurrency tests and edge-case handling on leaf node splitting. Minor optimization recommended for buffer page eviction.',
    submittedAt: '2026-09-23T18:42:00Z',
    submittedFileName: 'sterling_db_bplus_engine.zip'
  },
  {
    id: 'asg-4',
    courseCode: 'HUM-220',
    courseName: 'Ethics in AI & Digital Governance',
    title: 'Case Analysis: Algorithmic Accountability in Credit Scoring',
    description: 'Write a 1,500-word policy brief evaluating bias mitigation, fairness metrics (demographic parity vs equalized odds), and EU AI Act compliance.',
    dueDate: '2026-09-27T17:00:00Z',
    totalPoints: 50,
    status: 'submitted',
    submittedAt: '2026-09-27T15:20:00Z',
    submittedFileName: 'ai_governance_brief_draft_v2.pdf'
  }
];

export const initialEvents: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'HackCampus 2026: 36-Hour Autonomous Agent Hackathon',
    description: 'Join 300+ students building autonomous agents, spatial AI, and distributed tools. Food, hardware kits, mentors from leading labs, and $25,000 in project grants.',
    category: 'tech',
    date: 'Oct 10-12, 2026',
    time: '18:00 Friday - 12:00 Sunday',
    location: 'Ada Lovelace Center & Student Commons',
    roomId: 'room-202',
    capacity: 350,
    registeredCount: 284,
    isUserRegistered: true,
    speaker: 'Keynote by Dr. Sarah Vance (Chief Scientist, Horizon AI)',
    organizer: 'Computer Science Graduate Council',
    pointsAwarded: 15
  },
  {
    id: 'evt-2',
    title: 'Industry Keynote: Architecting Planet-Scale Cloud Infrastructure',
    description: 'An executive deep-dive into multi-region database replication, latency topology, and disaster recovery strategies deployed at tier-1 cloud providers.',
    category: 'career',
    date: 'Oct 04, 2026',
    time: '17:30 - 19:30',
    location: 'Turing Auditorium 101',
    roomId: 'room-101',
    capacity: 120,
    registeredCount: 98,
    isUserRegistered: false,
    speaker: 'Marc Henderson (VP of Cloud Systems)',
    organizer: 'IEEE Student Chapter',
    pointsAwarded: 10
  },
  {
    id: 'evt-3',
    title: 'Hands-on Workshop: Edge AI on Microcontrollers & TinyML',
    description: 'Flash quantized neural network models onto ARM Cortex-M4 development kits. Free hardware kit provided for the first 40 verified attendees.',
    category: 'tech',
    date: 'Oct 08, 2026',
    time: '14:00 - 17:00',
    location: 'Newton Hardware Studio 305',
    roomId: 'room-305',
    capacity: 40,
    registeredCount: 38,
    isUserRegistered: false,
    speaker: 'Lab Workshop Staff',
    organizer: 'Department of Electrical Engineering',
    pointsAwarded: 12
  },
  {
    id: 'evt-4',
    title: 'Annual Symphony & Digital Media Fusion Concert',
    description: 'Experience the University Philharmonic Orchestra performing alongside interactive generative visuals projection-mapped across the concert hall.',
    category: 'cultural',
    date: 'Oct 16, 2026',
    time: '19:30 - 21:30',
    location: 'University Performing Arts Pavilion',
    capacity: 600,
    registeredCount: 412,
    isUserRegistered: false,
    organizer: 'Arts & Cultural Society',
    pointsAwarded: 5
  }
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    studentName: 'Alex Rivera',
    studentEmail: 'a.rivera@campus.edu',
    appointmentType: 'academic_advising',
    facultyOrStaffName: 'Prof. David K. Sterling',
    preferredDate: '2026-10-02',
    preferredTime: '14:30',
    purpose: 'Senior Capstone project proposal review on Distributed Consensus',
    location: 'Turing Hall Room 402',
    status: 'confirmed',
    createdAt: '2026-09-28T09:15:00Z'
  },
  {
    id: 'apt-2',
    studentName: 'Alex Rivera',
    studentEmail: 'a.rivera@campus.edu',
    appointmentType: 'faculty_office_hours',
    facultyOrStaffName: 'Dr. Priya Ramanujan',
    preferredDate: '2026-10-04',
    preferredTime: '11:00',
    purpose: 'Clarification on Transformer Multi-Head Attention gradient backprop',
    location: 'Ada Lovelace Center Office 218',
    status: 'pending',
    createdAt: '2026-09-28T11:20:00Z'
  }
];

export const initialUsers: CampusUser[] = [
  {
    id: 'usr-stu-1',
    name: 'Alex Rivera',
    email: 'a.rivera@campus.edu',
    role: 'student',
    department: 'Computer Science & Engineering',
    titleOrMajor: 'B.S. in Computer Science (Senior)',
    idNumber: 'CS-2024-8841',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Sep 2023'
  },
  {
    id: 'usr-stu-2',
    name: 'Maya Chen',
    email: 'm.chen@campus.edu',
    role: 'student',
    department: 'Artificial Intelligence & Robotics',
    titleOrMajor: 'M.S. in Artificial Intelligence (Year 1)',
    idNumber: 'AI-2024-9122',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Aug 2024'
  },
  {
    id: 'usr-stu-3',
    name: 'Lucas Vance',
    email: 'l.vance@campus.edu',
    role: 'student',
    department: 'Electrical Engineering',
    titleOrMajor: 'B.S. in Embedded & IoT Hardware',
    idNumber: 'EE-2023-4519',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Jan 2023'
  },
  {
    id: 'usr-fac-1',
    name: 'Dr. Priya Ramanujan',
    email: 'p.ramanujan@campus.edu',
    role: 'faculty',
    department: 'Department of Computer Science',
    titleOrMajor: 'Lead Faculty & Researcher in Machine Learning',
    idNumber: 'FAC-AI-104',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Aug 2021'
  },
  {
    id: 'usr-fac-2',
    name: 'Prof. David K. Sterling',
    email: 'd.sterling@campus.edu',
    role: 'faculty',
    department: 'Distributed Systems & Cloud Computing',
    titleOrMajor: 'Professor & Department Chair',
    idNumber: 'FAC-CS-022',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Sep 2018'
  },
  {
    id: 'usr-fac-3',
    name: 'Prof. Sarah Jenkins',
    email: 's.jenkins@campus.edu',
    role: 'faculty',
    department: 'Information Systems',
    titleOrMajor: 'Associate Professor of Database Engineering',
    idNumber: 'FAC-DS-309',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Feb 2020'
  },
  {
    id: 'usr-adm-1',
    name: 'Dean Marcus Vance',
    email: 'm.vance@campus.edu',
    role: 'admin',
    department: 'Office of the Provost & Digital Operations',
    titleOrMajor: 'Dean of Academic Operations & IoT Infrastructure',
    idNumber: 'ADM-DIR-001',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Jun 2017'
  },
  {
    id: 'usr-adm-2',
    name: 'Eleanor Vance',
    email: 'e.vance@campus.edu',
    role: 'admin',
    department: 'Campus Registrar & Enrollment Services',
    titleOrMajor: 'Senior Academic Registrar & Compliance Officer',
    idNumber: 'ADM-REG-014',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    status: 'active',
    joinedDate: 'Aug 2019'
  }
];

export const initialLoginLogs: LoginAuditLog[] = [
  {
    id: 'log-101',
    userId: 'usr-stu-1',
    name: 'Alex Rivera',
    email: 'a.rivera@campus.edu',
    idNumber: 'CS-2024-8841',
    role: 'student',
    department: 'Computer Science & Engineering',
    timestamp: '2026-09-28T22:15:00Z',
    loginMethod: 'credential_login',
    ipSimulated: '192.168.1.104 (Campus Wi-Fi AP-04)',
    status: 'authorized'
  },
  {
    id: 'log-102',
    userId: 'usr-fac-1',
    name: 'Dr. Priya Ramanujan',
    email: 'p.ramanujan@campus.edu',
    idNumber: 'FAC-AI-104',
    role: 'faculty',
    department: 'Department of Computer Science',
    timestamp: '2026-09-28T21:40:00Z',
    loginMethod: 'role_preset',
    ipSimulated: '192.168.1.88 (Faculty Hall Ethernet)',
    status: 'authorized'
  },
  {
    id: 'log-103',
    userId: 'usr-adm-1',
    name: 'Dean Marcus Vance',
    email: 'm.vance@campus.edu',
    idNumber: 'ADM-DIR-001',
    role: 'admin',
    department: 'Office of the Provost & Digital Operations',
    timestamp: '2026-09-28T20:05:00Z',
    loginMethod: 'credential_login',
    ipSimulated: '10.0.4.12 (Provost Executive Gateway)',
    status: 'authorized'
  }
];
