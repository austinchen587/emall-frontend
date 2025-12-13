export default function StatusFilters({
  statusCategories,
  selectedStatus,
  setSelectedStatus,
  getDetailStatusColor,
}: {
  statusCategories: { status: string, count: number }[];
  selectedStatus: string | null;
  setSelectedStatus: (s: string | null) => void;
  getDetailStatusColor: (status: string) => string;
}) {
  return (
    <div className="sidebar-section">
      <div className="sidebar-header">
        <h3 className="sidebar-title">状态筛选</h3>
        <button 
          className="clear-filter"
          onClick={() => setSelectedStatus(null)}
          disabled={!selectedStatus}
        >
          清除
        </button>
      </div>
      <div className="status-filters">
        {statusCategories.map(({ status, count }) => (
          <button
            key={status}
            className={`status-filter ${selectedStatus === status ? 'active' : ''}`}
            onClick={() => setSelectedStatus(status)}
          >
            <span 
              className="status-dot" 
              style={{ backgroundColor: getDetailStatusColor(status) }}
            ></span>
            <span className="status-label">{status}</span>
            <span className="status-count">{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}