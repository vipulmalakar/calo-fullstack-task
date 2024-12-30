import { Job } from '../types/job';
import { ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-900 font-semibold">Job ID: {job.id}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-md font-semibold ${
          job.status === 'resolved' ? 'bg-green-100 text-green-800' : 
          job.status === 'failed' ? 'bg-red-100 text-red-800' : 
          job.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          Status: {job.status}
        </span>
      </div>
      {job.status === 'resolved' && job.result && (
        <div className="px-6 py-4 bg-gray-50">
          <a
            href={job.result}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Result <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  );
}