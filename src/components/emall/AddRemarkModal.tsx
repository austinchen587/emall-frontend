// src/components/emall/AddRemarkModal.tsx
import React, { useState, useEffect } from 'react';
import { emallApi } from '../../services/api_emall';

interface AddRemarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  procurementId: number;
  procurementTitle: string;
  onSuccess?: () => void;
}

const AddRemarkModal: React.FC<AddRemarkModalProps> = ({
  isOpen,
  onClose,
  procurementId,
  procurementTitle,
  onSuccess
}) => {
  const [remarkContent, setRemarkContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setRemarkContent('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!remarkContent.trim()) {
      setError('备注内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 使用统一的备注API，而不是采购进度相关的API
      const response = await emallApi.addUnifiedRemark(procurementId, remarkContent.trim());
      
      if (response.data && response.data.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(response.data?.error || '添加备注失败');
      }
    } catch (err: any) {
      console.error('添加备注失败:', err);
      setError(err.response?.data?.error || '添加备注失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>添加备注 - {procurementTitle}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>备注内容</label>
            <textarea
              value={remarkContent}
              onChange={(e) => setRemarkContent(e.target.value)}
              placeholder="请输入备注内容..."
              rows={5}
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !remarkContent.trim()}
            >
              {loading ? '添加中...' : '添加备注'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRemarkModal;
