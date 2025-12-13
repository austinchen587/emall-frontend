import { QuotedProjectType } from '../services/types/quoted_projects';

export default function TypeSelector({
  type,
  setType,
  setSelectedStatus,
  typeLabels,
}: {
  type: QuotedProjectType;
  setType: (t: QuotedProjectType) => void;
  setSelectedStatus: (s: string | null) => void;
  typeLabels: Record<QuotedProjectType, string>;
}) {
  return (
    <div className="sidebar-section">
      <h3 className="sidebar-title">项目类型</h3>
      <div className="type-selector">
        {(['bidding', 'reverse'] as QuotedProjectType[]).map(t => (
          <button
            key={t}
            className={`type-button ${type === t ? 'active' : ''}`}
            onClick={() => { setType(t); setSelectedStatus(null); }}
          >
            <span className="type-icon">
              {t === 'bidding' ? '💰' : '🔄'}
            </span>
            {typeLabels[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
