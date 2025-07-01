import { useState, useContext } from 'react';
import { Comment } from '../types/project';
import { UserContext } from '../context/UserContext';

interface ProjectCommentsProps {
  projectId: string;
  comments: Comment[];
  onAddComment: (content: string, userName?: string) => Promise<void>;
}

const ProjectComments = ({ projectId, comments, onAddComment }: ProjectCommentsProps) => {
  const { user } = useContext(UserContext);
  const [newComment, setNewComment] = useState('');
  const [publicName, setPublicName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    // For public users, require a name
    if (!user && !publicName.trim()) {
      alert('Please enter your name to post a comment.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment(newComment.trim(), !user ? publicName.trim() : undefined);
      setNewComment('');
      if (!user) setPublicName('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Comments</h4>
      
      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        {/* Public user name input */}
        {!user && (
          <div className="mb-4">
            <label htmlFor="publicName" className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              id="publicName"
              value={publicName}
              onChange={(e) => setPublicName(e.target.value)}
              placeholder="Enter your name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
              required
            />
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts about this project..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm resize-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim() || (!user && !publicName.trim())}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isSubmitting || !newComment.trim() || (!user && !publicName.trim())
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Post Comment'
            )}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 font-medium">
                      {comment.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{comment.userName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(comment.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.content}</p>
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-lg p-3">
                      <div className="flex items-center mb-2">
                        <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-800 text-xs font-medium">
                            {reply.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-900">{reply.userName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(reply.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectComments; 