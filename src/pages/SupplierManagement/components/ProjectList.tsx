// src/pages/SupplierManagement/components/ProjectList.tsx
import React from 'react';
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
  onToggleTimeFilter
}) => {
  // 按时间过滤器分组项目
  const groupProjectsByTimeFilter = () => {
    const grouped: { [key: string]: Project[] } = {};
    
    timeFilterOptions.forEach(option => {
      if (option.value === 'all') {
        grouped[option.value] = projects;
      } else {
        grouped[option.value] = projects.filter(project => {
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
      <div className="time-filter-section">
        <h3>时间筛选</h3>
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
                        <span>{new Date(project.selected_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-projects">暂无项目</div>
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
