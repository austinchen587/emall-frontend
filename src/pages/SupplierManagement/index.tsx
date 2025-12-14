// src/pages/SupplierManagement/index.tsx
import React, { useState, useEffect } from 'react';
import { supplierAPI, Project, ProjectSuppliersResponse, TimeFilterOption } from '../../services/api_supplier';
import ProjectList from './components/ProjectList';
import SupplierManagement from './components/SupplierManagement';
import './SupplierManagement.css';

const SupplierManagementPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSuppliers, setProjectSuppliers] = useState<ProjectSuppliersResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeFilter, setTimeFilter] = useState<string>('today');
  const [expandedTimeFilters, setExpandedTimeFilters] = useState<Set<string>>(new Set(['today']));

  // 新增：竞标成功项目相关状态
  const [successProjects, setSuccessProjects] = useState<Project[]>([]);
  const [loadingSuccess, setLoadingSuccess] = useState(false);
  const [expandedSuccess, setExpandedSuccess] = useState(false);

  const timeFilterOptions: TimeFilterOption[] = [
    { value: 'today', label: '今天', expanded: true },
    { value: 'yesterday', label: '昨天' },
    { value: 'this_week', label: '本周' },
    { value: 'this_month', label: '本月' },
    { value: 'all', label: '过往全部' }
  ];

  // 加载项目列表
  const loadProjects = async (filter?: string) => {
    try {
      setLoading(true);
      const projectsData = await supplierAPI.getProjects(filter);
      setProjects(projectsData);
    } catch (error) {
      console.error('加载项目列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载项目供应商详情
  const loadProjectSuppliers = async (projectId: number) => {
    try {
      setLoading(true);
      const suppliersData = await supplierAPI.getProjectSuppliers(projectId);
      setProjectSuppliers(suppliersData);
    } catch (error) {
      console.error('加载供应商详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载竞标成功项目
  const loadSuccessProjects = async () => {
    try {
      setLoadingSuccess(true);
      const data = await supplierAPI.getSuccessProjects();
      setSuccessProjects(data);
    } catch (error) {
      console.error('加载竞标成功项目失败:', error);
    } finally {
      setLoadingSuccess(false);
    }
  };

  // 切换时间过滤器展开状态
  const toggleTimeFilter = (filterValue: string) => {
    setExpandedTimeFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(filterValue)) {
        newSet.delete(filterValue);
      } else {
        newSet.add(filterValue);
      }
      return newSet;
    });
  };

  // 选择项目
  const handleSelectProject = async (project: Project) => {
    setSelectedProject(project);
    await loadProjectSuppliers(project.id);
  };

  // 切换时间过滤器
  const handleTimeFilterChange = async (filter: string) => {
    setTimeFilter(filter);
    await loadProjects(filter);
    // 自动展开选中的时间段
    if (!expandedTimeFilters.has(filter)) {
      toggleTimeFilter(filter);
    }
  };

  // 展开/收起竞标成功区域时加载
  useEffect(() => {
    if (expandedSuccess) {
      loadSuccessProjects();
    }
  }, [expandedSuccess]);

  useEffect(() => {
    loadProjects(timeFilter);
  }, []);

  return (
    <div className="supplier-management-page">
      <div className="page-header">
        <h1>供应商管理</h1>
      </div>
      
      <div className="supplier-layout">
        {/* 左侧项目列表 - 3/10宽度 */}
        <div className="project-sidebar">
          <ProjectList
            projects={projects}
            selectedProject={selectedProject}
            timeFilter={timeFilter}
            timeFilterOptions={timeFilterOptions}
            expandedTimeFilters={expandedTimeFilters}
            loading={loading}
            onSelectProject={handleSelectProject}
            onTimeFilterChange={handleTimeFilterChange}
            onToggleTimeFilter={toggleTimeFilter}
            // 新增竞标成功相关props
            successProjects={successProjects}
            loadingSuccess={loadingSuccess}
            expandedSuccess={expandedSuccess}
            onToggleSuccess={() => setExpandedSuccess(exp => !exp)}
          />
        </div>

        {/* 右侧供应商管理 - 7/10宽度 */}
        <div className="supplier-main">
          <SupplierManagement
            selectedProject={selectedProject}
            projectSuppliers={projectSuppliers}
            loading={loading}
            onRefresh={() => selectedProject && loadProjectSuppliers(selectedProject.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierManagementPage;
