import React, { useEffect } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ProcurementTable from '../../components/procurement/ProcurementTable';
import ProcurementModal from '../../components/procurement/ProcurementModal';
import { useProcurementStore } from '../../stores/procurementStore';

const Procurement: React.FC = () => {
  const { procurements, loading, fetchProcurements } = useProcurementStore();
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    fetchProcurements();
  }, [fetchProcurements]);

  const handleCreate = () => {
    setModalVisible(true);
  };

  const handleSuccess = () => {
    setModalVisible(false);
    message.success('采购项创建成功');
    fetchProcurements();
  };

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>采购管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建采购
        </Button>
      </div>

      <ProcurementTable 
        data={procurements} 
        loading={loading}
        onRefresh={fetchProcurements}
      />

      <ProcurementModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Procurement;
