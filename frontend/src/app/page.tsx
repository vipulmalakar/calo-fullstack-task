'use client';

import { useState, useEffect } from 'react';
import axios from './services/api';
import { JobCard } from './components/JobCard';
import { CreateJobModal } from './components/CreateJobModal';
import { Plus, Loader2 } from 'lucide-react';
import { Job } from './types/job';
import { Toaster, toast } from 'react-hot-toast';
import { connectSocket, disconnectSocket } from './services/socketService';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();

    const handleJobUpdate = (updatedJob: Job) => {
      setJobs(prevJobs => prevJobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    };

    const cleanup = connectSocket(handleJobUpdate);

    return () => {
      cleanup();
      disconnectSocket();
    };
  }, []);

  // Fetch all jobs from the backend
  const fetchJobs = async (retryCount = 3): Promise<void> => {
    try {
      setLoading(true);
      const response = await axios.get<Job[]>('/jobs');
      setJobs(response.data);
    } catch (error) {
      if (retryCount > 0) {
        setTimeout(() => fetchJobs(retryCount - 1), 1000);
      } else {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch jobs. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch a specific job by ID from the backend
  const fetchJobById = async (id: string, retryCount = 3): Promise<void> => {
    try {
      const response = await axios.get<Job>(`/jobs/${id}`);
      setJobs(prevJobs => prevJobs.map(job => job.id === id ? response.data : job));
    } catch (error) {
      if (retryCount > 0) {
        setTimeout(() => fetchJobById(id, retryCount - 1), 1000);
      } else {
        console.error(`Error fetching job with ID ${id}:`, error);
        toast.error('Failed to fetch job details. Please try again.');
      }
    }
  };

  // Create a new job and add it to the job list
  const createJob = async (): Promise<void> => {
    const optimisticJob: Job = { id: `temp-${Date.now()}`, status: 'pending', result: undefined, createdAt: new Date().toISOString(), name: 'Optimistic Job' };
    setJobs(prevJobs => [...prevJobs, optimisticJob]);

    try {
      const response = await axios.post<{ id: string }>('/jobs');
      toast.success('New job created successfully.');
      setJobs(prevJobs => prevJobs.map(job => job.id === optimisticJob.id ? { ...job, id: response.data.id } : job));
    } catch (error) {
      setJobs(prevJobs => prevJobs.filter(job => job.id !== optimisticJob.id));
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster position="bottom-right" toastOptions={{ duration: 3000 }} />
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Job Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="inline-block mr-2 h-4 w-4" /> Create New Job
        </button>
      </header>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="mr-2 h-8 w-8 animate-spin" />
          <p className="text-lg">Loading jobs...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onFetchJobById={fetchJobById} />
          ))}
        </div>
      )}

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No jobs found. Create a new job to get started!</p>
        </div>
      )}

      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJob={createJob}
      />
    </div>
  );
}