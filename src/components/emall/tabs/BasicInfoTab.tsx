// src/components/emall/tabs/BasicInfoTab.tsx
import React from 'react';
import { ProcurementProgressData, ClientContact } from '../../../services/types';

interface BasicInfoTabProps {
	data: ProcurementProgressData;
	biddingStatus: string;
	clientContacts: ClientContact[];
	onBiddingStatusChange: (status: string) => void;
	onClientContactsChange: (contacts: ClientContact[]) => void;
}

const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
	biddingStatus,
	clientContacts,
	onBiddingStatusChange,
	onClientContactsChange
}) => {
	const addContact = () => {
		const newContacts = [...clientContacts, { id: Date.now(), name: '', contact_info: '' }];
		onClientContactsChange(newContacts);
	};

	const updateContact = (index: number, field: keyof ClientContact, value: string) => {
		const newContacts = [...clientContacts];
		newContacts[index] = { ...newContacts[index], [field]: value };
		onClientContactsChange(newContacts);
	};

	const removeContact = (index: number) => {
		const newContacts = clientContacts.filter((_, i) => i !== index);
		onClientContactsChange(newContacts);
	};

	return (
		<div className="basic-info-tab">
			<div className="form-group">
				<label>竞标状态</label>
				<select 
					value={biddingStatus} 
					onChange={(e) => onBiddingStatusChange(e.target.value)}
					className="form-select"
				>
					<option value="not_started">未开始</option>
					<option value="in_progress">进行中</option>
					<option value="successful">竞标成功</option>
					<option value="failed">竞标失败</option>
					<option value="cancelled">已取消</option>
				</select>
			</div>

			<div className="form-group">
				<div className="contacts-header">
					<label>甲方联系人</label>
					<button type="button" onClick={addContact} className="btn-add-contact">
						添加联系人
					</button>
				</div>
				
				<div className="contacts-list">
					{clientContacts.map((contact, index) => (
						<div key={contact.id || `contact-${index}`} className="contact-item">
							<div className="contact-fields">
								<input
									type="text"
									value={contact.name}
									onChange={(e) => updateContact(index, 'name', e.target.value)}
									className="form-input"
									placeholder="联系人姓名"
								/>
								<input
									type="text"
									value={contact.contact_info}
									onChange={(e) => updateContact(index, 'contact_info', e.target.value)}
									className="form-input"
									placeholder="联系方式（电话、邮箱等）"
								/>
							</div>
							<button
								type="button"
								onClick={() => removeContact(index)}
								className="btn-remove-contact"
								disabled={clientContacts.length <= 1}
							>
								删除
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default BasicInfoTab;
