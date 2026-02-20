// src/pages/SupplierManagement/components/ProjectList.tsx
import React, { useState } from 'react';
import { Project, TimeFilterOption } from '../../../services/api_supplier';
import './ProjectList.css';

interface ProjectListProps {
  projects: Project[];
  selectedProject: Project | null;
  timeFilter: string;
  timeFilterOptions: TimeFilterOption[];
  expandedTimeFilters: Set<string>;
  loading: boolean;
  onSelectProject: (project: Project) => void;
  onTimeFilterChange: (filter: string) => void;
  onToggleTimeFilter: (filter: string) => void;
  successProjects: Project[];
  loadingSuccess: boolean;
  expandedSuccess: boolean;
  onToggleSuccess: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  selectedProject,
  timeFilter,
  timeFilterOptions,
  expandedTimeFilters,
  loading,
  onSelectProject,
  onTimeFilterChange,
  onToggleTimeFilter,
  successProjects,
  loadingSuccess,
  expandedSuccess,
  onToggleSuccess = () => {},
}) => {
  // 新增：搜索状态
  const [searchTerm, setSearchTerm] = useState('');

  // 新增：搜索过滤逻辑（支持按项目名称或负责人搜索）
  const filterProjects = (list: Project[]) => {
    if (!searchTerm.trim()) return list;
    const term = searchTerm.toLowerCase();
    return list.filter(p => 
      (p.project_name && p.project_name.toLowerCase().includes(term)) ||
      (p.project_owner && p.project_owner.toLowerCase().includes(term))
    );
  };

  const searchedProjects = filterProjects(projects);
  const searchedSuccessProjects = filterProjects(successProjects);

  // 按时间过滤器分组项目 (使用搜索过滤后的数据)
  const groupProjectsByTimeFilter = () => {
    const grouped: { [key: string]: Project[] } = {};
    
    timeFilterOptions.forEach(option => {
      if (option.value === 'all') {
        grouped[option.value] = searchedProjects;
      } else {
        grouped[option.value] = searchedProjects.filter(project => {
          const projectDate = new Date(project.selected_at);
          const now = new Date();
          
          switch (option.value) {
            case 'today':
              return projectDate.toDateString() === now.toDateString();
            case 'yesterday':
              const yesterday = new Date(now);
              yesterday.setDate(yesterday.getDate() - 1);
              return projectDate.toDateString() === yesterday.toDateString();
            case 'this_week':
              const startOfWeek = new Date(now);
              startOfWeek.setDate(now.getDate() - now.getDay());
              startOfWeek.setHours(0, 0, 0, 0);
              return projectDate >= startOfWeek;
            case 'this_month':
              const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
              return projectDate >= startOfMonth;
            default:
              return true;
          }
        });
      }
    });
    
    return grouped;
  };

  const groupedProjects = groupProjectsByTimeFilter();

  return (
    <div className="project-list">
      {/* 新增：搜索输入框区域 */}
      <div className="project-search-box">
        <input 
          type="text" 
          placeholder="搜索项目名称或负责人..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="project-search-input"
        />
      </div>

      <div className="time-filter-section">
        <h3>时间筛选</h3>
        {/* 竞标成功筛选区域 */}
        <div className="time-filter-group">
          <div
            className={`time-filter-header`}
            onClick={onToggleSuccess}
          >
            <span>竞标成功</span>
            <button
              className="toggle-btn"
              onClick={e => {
                e.stopPropagation();
                onToggleSuccess();
              }}
            >
              {expandedSuccess ? '−' : '+'}
            </button>
          </div>
          {expandedSuccess && (
            <div className="project-items">
              {loadingSuccess ? (
                <div className="loading">加载中...</div>
              ) : searchedSuccessProjects.length > 0 ? (
                // 按 selected_at 降序排序
                [...searchedSuccessProjects]
                  .sort((a, b) => new Date(b.selected_at).getTime() - new Date(a.selected_at).getTime())
                  .map(project => (
                    <div
                      key={project.id}
                      className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                      onClick={() => onSelectProject(project)}
                    >
                      <div className="project-name">{project.project_name}</div>
                      <div className="project-meta">
                        <span>供应商: {project.supplier_count}</span>
                        <span>负责人: {project.project_owner || '-'}</span>
                        <span>
                          系统状态: {
                            (project as any).bidding_status_display ||
                            (typeof project.bidding_status === 'string'
                              ? project.bidding_status
                              : project.bidding_status?.status || '-')
                          }
                        </span>
                        <span>{new Date(project.selected_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="no-projects">暂无匹配项目</div>
              )}
            </div>
          )}
        </div>
        
        {/* 原有时间筛选区域 */}
        {timeFilterOptions.map(option => (
          <div key={option.value} className="time-filter-group">
            <div 
              className={`time-filter-header ${timeFilter === option.value ? 'active' : ''}`}
              onClick={() => onTimeFilterChange(option.value)}
            >
              <span>{option.label}</span>
              <button 
                className="toggle-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTimeFilter(option.value);
                }}
              >
                {expandedTimeFilters.has(option.value) ? '−' : '+'}
              </button>
            </div>
            
            {expandedTimeFilters.has(option.value) && (
              <div className="project-items">
                {loading ? (
                  <div className="loading">加载中...</div>
                ) : groupedProjects[option.value]?.length > 0 ? (
                  groupedProjects[option.value].map(project => (
                    <div
                      key={project.id}
                      className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
                      onClick={() => onSelectProject(project)}
                    >
                      <div className="project-name">{project.project_name}</div>
                      <div className="project-meta">
                        <span>供应商: {project.supplier_count}</span>
                        <span>负责人: {project.project_owner || '-'}</span>
                        <span>
                          系统状态: {
                            (project as any).bidding_status_display ||
                            (typeof project.bidding_status === 'string'
                              ? project.bidding_status
                              : project.bidding_status?.status || '-')
                          }
                        </span>
                        <span>{new Date(project.selected_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-projects">暂无匹配项目</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;