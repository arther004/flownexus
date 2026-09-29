/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Assignment, UserRole } from '../../types/campus';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileText,
  X,
  Plus,
  Check
} from 'lucide-react';

interface AssignmentsViewProps {
  role: UserRole;
  assignments: Assignment[];
  onSubmitAssignment: (id: string, fileName: string) => Promise<void>;
  onGradeAssignment: (id: string, grade: number, feedback: string) => Promise<void>;
  onAddNewAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => Promise<void>;
}

export const AssignmentsView: React.FC<AssignmentsViewProps> = ({
  role,
  assignments,
  onSubmitAssignment,
  onGradeAssignment,
  onAddNewAssignment
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Submission Form State
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Grade Form State
  const [assignedGrade, setAssignedGrade] = useState<number>(90);
  const [feedbackNotes, setFeedbackNotes] = useState('');

  // Create Assignment State
  const [newCourseCode, setNewCourseCode] = useState('CS-401');
  const [newCourseName, setNewCourseName] = useState('Distributed Systems & Cloud Architecture');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-10-15T23:59');
  const [newPoints, setNewPoints] = useState(100);

  const filteredAssignments = assignments.filter(asg => {
    if (filterStatus === 'all') return true;
    return asg.status === filterStatus;
  });

  const handleOpenSubmit = (asg: Assignment) => {
    setSelectedAssignment(asg);
    setFileName(`solution_${asg.courseCode.toLowerCase().replace('-', '_')}_submission.zip`);
    setSubmitModalOpen(true);
  };

  const handleOpenGrade = (asg: Assignment) => {
    setSelectedAssignment(asg);
    setAssignedGrade(asg.grade || 92);
    setFeedbackNotes(asg.feedback || 'Well-structured implementation. Good test coverage.');
    setGradeModalOpen(true);
  };

  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment || !fileName.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmitAssignment(selectedAssignment.id, fileName.trim());
      setSubmitModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
      await onGradeAssignment(selectedAssignment.id, Number(assignedGrade), feedbackNotes);
      setGradeModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNewAssignment({
        courseCode: newCourseCode,
        courseName: newCourseName,
        title: newTitle.trim(),
        description: newDescription.trim(),
        dueDate: new Date(newDueDate).toISOString(),
        totalPoints: Number(newPoints)
      });
      setCreateModalOpen(false);
      setNewTitle('');
      setNewDescription('');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper for human-readable deadline
  const formatDeadline = (iso: string) => {
    const due = new Date(iso);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Past Deadline';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return 'Due Tomorrow';
    return `Due in ${diffDays} days`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Coursework & Assignments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Submit coursework, track academic deadlines, and inspect faculty grading rubrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Segmented Filter Control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({assignments.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('submitted')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'submitted'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Turned In
            </button>
            <button
              onClick={() => setFilterStatus('graded')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filterStatus === 'graded'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Graded
            </button>
          </div>

          {(role === 'faculty' || role === 'admin') && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Assignment</span>
            </button>
          )}
        </div>
      </div>

      {/* Assignment List */}
      <div className="space-y-4">
        {filteredAssignments.map(asg => {
          const deadlineText = formatDeadline(asg.dueDate);
          const isUrgentDue = deadlineText.includes('Today') || deadlineText.includes('Tomorrow');

          return (
            <div
              key={asg.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              <div className="space-y-2 max-w-2xl">
                {/* Meta without pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {asg.courseCode}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{asg.courseName}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{asg.totalPoints} Maximum Points</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.description}
                </p>

                {/* Submission details or feedback */}
                {asg.status === 'submitted' && asg.submittedFileName && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400 pt-1">
                    <FileText className="w-3.5 h-3.5 text-emerald-500" />
                    <span>File: {asg.submittedFileName}</span>
                    <span aria-hidden="true">·</span>
                    <span>Submitted: {new Date(asg.submittedAt || '').toLocaleDateString()}</span>
                  </div>
                )}

                {asg.status === 'graded' && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-200 space-y-1">
                    <div className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Graded: {asg.grade} / {asg.totalPoints} points</span>
                    </div>
                    {asg.feedback && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                        "{asg.feedback}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Right Action & Deadline Zone */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(asg.dueDate).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div
                    className={`text-xs font-medium mt-0.5 flex items-center gap-1 sm:justify-end ${
                      isUrgentDue
                        ? 'text-amber-600 dark:text-amber-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{deadlineText}</span>
                  </div>
                </div>

                {/* Role Specific Actions */}
                {role === 'student' && asg.status === 'pending' && (
                  <button
                    onClick={() => handleOpenSubmit(asg)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Turn In</span>
                  </button>
                )}

                {role === 'student' && asg.status === 'submitted' && (
                  <span className="px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 rounded-lg">
                    Awaiting Review
                  </span>
                )}

                {(role === 'faculty' || role === 'admin') && (
                  <button
                    onClick={() => handleOpenGrade(asg)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {asg.status === 'graded' ? 'Update Grade' : 'Grade Submission'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Student Submit Modal */}
      {submitModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setSubmitModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Submit Coursework
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {selectedAssignment.courseCode} · {selectedAssignment.title}
            </p>

            <form onSubmit={handleSubmitWork} className="space-y-4">
              {/* Dropzone Simulator */}
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center space-y-2">
                <UploadCloud className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  Select assignment artifact or drop source archive
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Supported formats: .zip, .tar.gz, .pdf, .ipynb (Max 50MB)
                </div>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={e => setFileName(e.target.value)}
                  placeholder="e.g. project_submission.zip"
                  className="mt-2 w-full max-w-xs mx-auto px-3 py-1.5 text-xs text-center font-mono rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
                Academic Integrity Notice: By submitting, you certify this work is solely your own in compliance with the university honor code.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Confirm Submission'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Faculty Grade Modal */}
      {gradeModalOpen && selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setGradeModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Grade Student Submission
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {selectedAssignment.courseCode} · {selectedAssignment.title}
            </p>

            <form onSubmit={handleSaveGrade} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Awarded Score (Out of {selectedAssignment.totalPoints})
                </label>
                <input
                  type="number"
                  min="0"
                  max={selectedAssignment.totalPoints}
                  value={assignedGrade}
                  onChange={e => setAssignedGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Faculty Feedback & Rubric Notes
                </label>
                <textarea
                  rows={3}
                  value={feedbackNotes}
                  onChange={e => setFeedbackNotes(e.target.value)}
                  placeholder="Provide constructive feedback on implementation, test cases, and design..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradeModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Saving...' : 'Publish Grade'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Assignment Modal (Faculty / Admin) */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl relative">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              Create Coursework Assignment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Publish a new coursework brief to the student portal and database.
            </p>

            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseCode}
                    onChange={e => setNewCourseCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Total Points
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lab 4: Consensus & Sharding Benchmark"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Problem Description & Requirements
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline the assignment requirements, rubrics, and deliverable format..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Submission Deadline
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Publishing...' : 'Publish Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
