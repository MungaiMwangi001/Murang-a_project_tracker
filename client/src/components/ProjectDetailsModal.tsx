import { useState } from 'react';
import { Project, Comment } from '../types/project';
import ProjectComments from './ProjectComments';

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const [isAddingComment, setIsAddingComment] = useState(false);

  if (!project || !isOpen) return null;

  const handleAddComment = async (content: string, userName?: string) => {
    try {
      setIsAddingComment(true);
      // TODO: Replace with actual API call to add comment
      console.log('Adding comment:', content, 'by:', userName || 'authenticated user');
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For now, we'll just log the comment
      // In a real application, you would:
      // 1. Make an API call to save the comment
      // 2. Update the project's comments in the parent component
      // 3. Show a success message
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsAddingComment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Project Images Carousel */}
          {project.images && project.images.length > 0 && (
            <div className="relative h-64 sm:h-72 md:h-96 bg-gray-900">
              <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                {/* Header Section */}
                <div className="border-b border-gray-200 pb-4 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold text-gray-900" id="modal-title">
                      {project.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'stalled' ? 'bg-red-100 text-red-800' :
                        project.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                        'bg-purple-100 text-purple-800'}`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600">{project.description}</p>
                </div>

                {/* Project Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Project Information</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Department</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.department}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Directorate</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.directorate}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Location</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.ward}, {project.subCounty}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Project PMC</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.pmc}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Contract Details</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contract Name</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.contractName}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contract Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.contractNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">LPO Number</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.lpoNumber}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contractor</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.contractor}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Financial Information</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Budgeted Cost</dt>
                          <dd className="mt-1 text-sm text-gray-900">KES {project.budgetedCost.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Source of Funds</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.sourceOfFunds}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contract Cost</dt>
                          <dd className="mt-1 text-sm text-gray-900">KES {project.contractCost.toLocaleString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Amount Paid to Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">KES {project.amountPaidToDate.toLocaleString()}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-4">Timeline & Progress</h4>
                      <dl className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Contract Period</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.contractPeriod}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{new Date(project.contractStartDate).toLocaleDateString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">End Date</dt>
                          <dd className="mt-1 text-sm text-gray-900">{new Date(project.contractEndDate).toLocaleDateString()}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Implementation Status</dt>
                          <dd className="mt-1 text-sm text-gray-900">{project.implementationStatus}</dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Progress</dt>
                          <dd className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  project.status === 'completed' ? 'bg-green-600' :
                                  project.status === 'ongoing' ? 'bg-blue-600' :
                                  project.status === 'stalled' ? 'bg-red-600' :
                                  'bg-gray-600'
                                }`}
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">{project.progress}% Complete</p>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                {/* Recommendations Section */}
                {project.recommendations && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Recommendations</h4>
                    <p className="text-sm text-gray-900">{project.recommendations}</p>
                  </div>
                )}

                {/* Comments Section */}
                <ProjectComments
                  projectId={project.id}
                  comments={project.comments || []}
                  onAddComment={handleAddComment}
                />

                {/* Last Updated */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(project.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal; 