import { useState, useMemo } from 'react';
import { useQuotedProjects } from './hooks';
import { QuotedProjectType } from '../services/types/quoted_projects';
import './QuotedProjectsPage.css';
import ProjectsTable from './ProjectsTable';
import ProjectDetailModal from '../components/emall/ProjectDetailModal';
import { typeLabels, detailStatusColors } from './constants';

const typeOptions: { type: QuotedProjectType; label: string }[] = [
  { type: 'bidding', label: '竞价' },
  { type: 'reverse', label: '反拍' }
];

const statusOrder = [
  '已成交', '已报价', '结果评审中', '未成交', '未报价', '已失效'
];

export default function QuotedProjectsPage() {
  const [type, setType] = useState<QuotedProjectType>('bidding');
  const { data = [], loading } = useQuotedProjects(type);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const statusCategories = useMemo(() => {
    const map: Record<string, number> = {};
    (data as any[]).forEach(item => {
      map[item.status_category] = (map[item.status_category] || 0) + 1;
    });
    // 保证顺序
    return statusOrder
      .filter(status => map[status])
      .map(status => ({ status, count: map[status] }));
  }, [data]);

  const filtered = useMemo(
    () =>
      selectedStatus
        ? (data as any[]).filter(item => item.status_category === selectedStatus)
        : (data as any[]),
    [data, selectedStatus]
  );

  const getDetailStatusColor = (detailStatus: string) => {
    return detailStatusColors[detailStatus] || detailStatusColors['默认'];
  };

  const formatPrice = (price: string | number) => {
    const num = typeof price === 'string' ? Number(price) : price;
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="quoted-projects-container">
      {/* 页面标题 */}
      <header className="page-header">
        <h1 className="page-title">报价项目管理</h1>
        <div className="page-subtitle">查看和管理所有报价项目</div>
      </header>
      <div className="quoted-projects-content" style={{ display: 'flex' }}>
        {/* 左侧分类栏 */}
        <aside className="category-sidebar">
          <div className="category-group">
            {typeOptions.map(opt => (
              <div
                key={opt.type}
                className={`category-item${type === opt.type ? ' active' : ''}`}
                onClick={() => {
                  setType(opt.type);
                  setSelectedStatus(null);
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
          <div className="category-group sub-category-group">
            <div
              className={!selectedStatus ? 'category-item active' : 'category-item'}
              onClick={() => setSelectedStatus(null)}
            >
              全部 <span className="count">{data.length}</span>
            </div>
            {statusCategories.map(cat => (
              <div
                key={cat.status}
                className={
                  selectedStatus === cat.status
                    ? 'category-item active'
                    : 'category-item'
                }
                style={{
                  backgroundColor: selectedStatus === cat.status ? getDetailStatusColor(cat.status) : undefined,
                  color: selectedStatus === cat.status ? '#fff' : undefined
                }}
                onClick={() => setSelectedStatus(cat.status)}
              >
                {cat.status} <span className="count">{cat.count}</span>
              </div>
            ))}
          </div>
        </aside>
        {/* 右侧内容 */}
        <main className="projects-main" style={{ flex: 1 }}>
          <div className="main-header">
            <div className="header-info">
              <h2 className="main-title">
                {typeLabels[type]}项目
                {selectedStatus && (
                  <span className="filter-indicator"> - {selectedStatus}</span>
                )}
              </h2>
              <div className="result-count">
                共 {filtered.length} 个项目
              </div>
            </div>
          </div>
          <ProjectsTable
            filtered={filtered}
            loading={loading}
            getDetailStatusColor={getDetailStatusColor}
            formatDate={formatDate}
            formatPrice={formatPrice}
            type={type}
            onShowProjectDetail={project => {
              setSelectedProject({
                ...project,
                project_number: project.procurement_emall_id
              });
              setShowProjectDetail(true);
            }}
          />
        </main>
      </div>
      {showProjectDetail && selectedProject && (
        <ProjectDetailModal
          isOpen={showProjectDetail}
          onClose={() => setShowProjectDetail(false)}
          project={selectedProject}
        />
      )}
    </div>
  );
}
