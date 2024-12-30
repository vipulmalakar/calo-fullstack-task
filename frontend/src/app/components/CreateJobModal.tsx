import { toast } from 'react-hot-toast';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateJob: () => void;
}

export function CreateJobModal({ isOpen, onClose, onCreateJob }: CreateJobModalProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreateJob()
    onClose()
    toast.success('Job creation initiated.')
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Create New Job</h2>
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-gray-600">Are you sure you want to create a new job?</p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Create Job
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}