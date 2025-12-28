import React from 'react';
import './ProjectsTable.css';

interface ProjectsTableProps {
  filtered: any[];
  loading: boolean;
  getDetailStatusColor: (status: string) => string;
  formatDate: (date: string | null) => string;
  formatPrice: (price: string | number) => string;
  type: string;
  onShowProjectDetail: (project: any) => void;
}

export default function ProjectsTable({
  filtered,
  loading,
  getDetailStatusColor,
  formatDate,
  formatPrice,
  type,
  onShowProjectDetail,
}: ProjectsTableProps) {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">加载中...</div>
      </div>
    );
  }

  const getSystemStatusClass = (status: string | undefined) => {
    if (!status) return 'status--';
    return `status-${status}`;
  };

  const formatNullableDate = (date: string | null) => {
    return date ? formatDate(date) : ''; // 如果为 null，显示为空字符串
  };

  return (
    <div className="table-container">
      <table className="projects-table">
        <thead>
          <tr>
            <th className="project-name">项目名称</th>
            <th className="project-owner">负责人</th>
            <th className="project-id">项目编号</th>
            <th className="project-status">官网状态</th>
            <th className="project-status">系统状态</th>
            <th className="project-date">开始时间</th>
            <th className="project-date">结束时间</th>
            <th className="project-date">中标时间</th>
            <th className="project-date">结算時間</th>
            <th className="project-price">期望总价</th>
            <th className="project-price">响应总额</th>
            <th className="project-price">结算金额</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={12} className="empty-state">
                <div className="empty-content">
                  📝 暂无项目数据
                </div>
              </td>
            </tr>
          ) : (
            filtered.map(item => (
              <tr key={item.project_id} className="project-row">
                <td className="project-name">
                  {item.procurement_project_name} {/* 修改：不论类型，都使用 procurement_project_name */}
                </td>
                <td className="project-owner">
                  {item.project_owner || '-'}
                </td>
                <td className="project-id">
                  {type === 'reverse' ? (
                    item.project_id
                  ) : (
                    <span
                      style={{
                        cursor: 'pointer',
                        color: '#1890ff',
                        textDecoration: 'underline'
                      }}
                      onClick={() => {
                        onShowProjectDetail({
                          ...item,
                          id: Math.abs(Number(item.procurement_emall_id))
                        });
                      }}
                    >
                      {item.project_id}
                    </span>
                  )}
                </td>
                <td className="project-status">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: getDetailStatusColor(item.status_category),
                      color: '#fff'
                    }}
                  >
                    {item.status_category}
                  </span>
                </td>
                <td className="project-status project-system-status">
                  <span
                    className={`system-status-badge ${getSystemStatusClass(item.bidding_status)}`}
                  >
                    {item.bidding_status || '-'}
                  </span>
                </td>
                <td className="project-date">
                  {formatDate(item.bid_start_time)}
                </td>
                <td className="project-date">
                  {formatDate(item.bid_end_time)}
                </td>
                <td className="project-date">
                  {formatNullableDate(item.winning_date)}
                </td>
                <td className="project-date">
                  {formatNullableDate(item.settlement_date)}
                </td>
                <td className="project-price">
                  {formatPrice(item.expected_total_price)}
                </td>
                <td className="project-price">
                  <span className={`price-amount ${Number(item.response_total) > 0 ? 'has-response' : ''}`}>
                    {formatPrice(item.response_total)}
                  </span>
                </td>
                <td className="project-price">
                  {formatPrice(item.settlement_amount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
