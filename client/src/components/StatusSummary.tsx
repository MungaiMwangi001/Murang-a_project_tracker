interface StatusCounts {
  completed: number;
  ongoing: number;
  stalled: number;
  notStarted: number;
  underProcurement: number;
  total: number;
}

interface StatusSummaryProps {
  counts: StatusCounts;
}

const StatusSummary = ({ counts }: StatusSummaryProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-500">Status:</span>
      </div>
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">Completed ({counts.completed})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">Ongoing ({counts.ongoing})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">Stalled ({counts.stalled})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-gray-500"></div>
          <span className="text-sm text-gray-600">Not Started ({counts.notStarted})</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">Under Procurement ({counts.underProcurement})</span>
        </div>
        <div className="flex items-center space-x-1 font-medium">
          <span className="text-sm text-gray-700">Total: {counts.total}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusSummary; 