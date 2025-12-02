// src/components/emall/tabs/OverviewTab.tsx
import React from 'react';
import { ProcurementProgressData } from '../../../services/types';
import { formatCurrency } from '../utils';
import './OverviewTab.css';

interface OverviewTabProps {
	data: ProcurementProgressData;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ data }) => {
	return (
		<div className="overview-tab">
			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-value">{formatCurrency(data.total_budget)}</div>
					<div className="stat-label">总预算</div>
				</div>
				<div className="stat-card">
					<div className="stat-value">{data.suppliers_info.length}</div>
					<div className="stat-label">供应商数量</div>
				</div>
				<div className="stat-card">
					<div className="stat-value">{data.bidding_status_display}</div>
					<div className="stat-label">竞标状态</div>
				</div>
			</div>

			{/* 修改：支持多个联系人显示 */}
			<div className="contact-info-card">
				<h4>联系人信息 ({data.client_contacts.length})</h4>
				<div className="contacts-list">
					{data.client_contacts.map((contact, index) => (
						<div key={contact.id || `contact-${index}`} className="contact-item">
							<div className="contact-detail">
								<span className="contact-name">{contact.name || '未设置姓名'}</span>
								<span className="contact-info">{contact.contact_info || '未设置联系方式'}</span>
							</div>
						</div>
					))}
					{data.client_contacts.length === 0 && (
						<div className="no-contacts">暂无联系人信息</div>
					)}
				</div>
			</div>

			<div className="suppliers-overview">
				<h4>供应商报价对比</h4>
				<div className="suppliers-list">
					{data.suppliers_info.map(supplier => (
						<div key={supplier.id} className={`supplier-card ${supplier.is_selected ? 'selected' : ''}`}>
							<div className="supplier-header">
								<span className="supplier-name">{supplier.name}</span>
								{supplier.is_selected && <span className="selected-badge">已选择</span>}
							</div>
							<div className="supplier-details">
								<span>报价: {formatCurrency(supplier.total_quote)}</span>
								<span className={`profit ${supplier.profit >= 0 ? 'positive' : 'negative'}`}>
									利润: {formatCurrency(supplier.profit)}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="remarks-preview">
				<h4>最新备注</h4>
				{data.remarks_history.slice(0, 3).map(remark => (
					<div key={remark.id} className="remark-item">
						<div className="remark-header">
							<span className="remark-creator">{remark.created_by}</span>
							<span className="remark-time">{remark.created_at_display}</span>
						</div>
						<p className="remark-content">{remark.remark_content}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default OverviewTab;
