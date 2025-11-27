import React, { useState, useEffect } from 'react';
import { emallApi } from '../../services/api_emall';
import { EmallItem } from '../../services/types';
import './EmallList.css';

const EmallList: React.FC = () => {
  const [emallItems, setEmallItems] = useState<EmallItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchEmallList();
  }, []);

  const fetchEmallList = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emallApi.getEmallList();
      
      // 根据你的API响应结构调整
      // 如果是分页响应
      if (response.data.results) {
        setEmallItems(response.data.results);
        setTotalCount(response.data.count || response.data.results.length);
      } else {
        // 如果是直接返回数组
        setEmallItems(response.data as any);
        setTotalCount((response.data as any).length);
      }
    } catch (err: any) {
      console.error('获取采购数据失败:', err);
      setError(err.response?.data?.detail || err.response?.data?.message || '获取数据失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="emall-container">
        <div className="loading">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="emall-container">
        <div className="error">{error}</div>
        <button onClick={fetchEmallList} className="retry-btn">重试</button>
      </div>
    );
  }

  return (
    <div className="emall-container">
      <div className="emall-header">
        <h1>采购项目列表</h1>
        <div className="stats">共 {totalCount} 个项目</div>
      </div>
      
      <div className="emall-table-container">
        <table className="emall-table">
          <thead>
            <tr>
              <th>项目标题</th>
              <th>采购单位</th>
              <th>发布时间</th>
              <th>地区</th>
              <th>项目名称</th>
              <th>总价控制</th>
            </tr>
          </thead>
          <tbody>
            {emallItems.map((item) => (
              <tr key={item.id} className="emall-row">
                <td className="project-title">{item.project_title}</td>
                <td>{item.purchasing_unit}</td>
                <td>{new Date(item.publish_date).toLocaleDateString()}</td>
                <td>{item.region}</td>
                <td>{item.project_name || '-'}</td>
                <td>{item.total_price_control || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {emallItems.length === 0 && (
          <div className="no-data">暂无数据</div>
        )}
      </div>
    </div>
  );
};

export default EmallList;
