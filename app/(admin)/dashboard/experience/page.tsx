"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useExperiences } from '@/hooks/useFirestore';
import { experienceService } from '@/services/firebase/store';
import { ExperienceForm } from '@/components/forms/ExperienceForm';
import { Experience } from '@/types/content';

export default function ExperiencesPage() {
  const { data: experiences, isLoading, error, refetch } = useExperiences();
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<(Experience & { id: string }) | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const maxOrder = experiences.length > 0
    ? Math.max(...experiences.map((e) => e.order)) + 1
    : 0;

  const handleCreate = () => {
    setEditingExperience(null);
    setShowForm(true);
  };

  const handleEdit = (experience: Experience & { id: string }) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      setDeletingId(id);
      await experienceService.delete(id);
      toast.success('Experience deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete experience');
    } finally {
      setDeletingId(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExperience(null);
    refetch();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  if (showForm) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {editingExperience ? 'Edit Experience' : 'Add Experience'}
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {editingExperience ? 'Update the experience details' : 'Add a new work experience to your portfolio'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <ExperienceForm
            experience={editingExperience || undefined}
            maxOrder={maxOrder}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Experiences</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your work history</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Add Experience
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-50" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {!isLoading && !error && experiences.length === 0 && (
        <div className="text-center py-12 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg">
          <p className="text-sm text-zinc-500">No experiences added yet</p>
          <button
            onClick={handleCreate}
            className="mt-3 text-sm font-medium text-zinc-900 dark:text-zinc-100 underline hover:no-underline"
          >
            Add your first experience
          </button>
        </div>
      )}

      {!isLoading && experiences.length > 0 && (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {exp.role}
                    </h3>
                    {exp.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{exp.company}</p>
                  <p className="text-xs text-zinc-500 mb-3">
                    {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </p>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-2">
                    {exp.description}
                  </p>
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.technologies.slice(0, 8).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.technologies.length > 8 && (
                        <span className="px-2 py-0.5 text-xs text-zinc-500">
                          +{exp.technologies.length - 8} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(exp)}
                    className="px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    disabled={deletingId === exp.id}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-800 rounded hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors disabled:opacity-50"
                  >
                    {deletingId === exp.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}