import React from 'react';
import { Modal, Form, Input, InputNumber, Button, message } from 'antd';

interface ProcurementModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ProcurementModal: React.FC<ProcurementModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 模拟API调用
      setTimeout(() => {
        console.log('创建采购项:', values);
        onSuccess();
        form.resetFields();
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error('创建采购项失败');
      setLoading(false);
    }
  };

  return (
    <Modal
      title="新建采购项"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="name"
          label="商品名称"
          rules={[{ required: true, message: '请输入商品名称' }]}
        >
          <Input placeholder="请输入商品名称" />
        </Form.Item>

        <Form.Item
          name="description"
          label="商品描述"
        >
          <Input.TextArea placeholder="请输入商品描述" rows={3} />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="数量"
          rules={[{ required: true, message: '请输入数量' }]}
        >
          <InputNumber min={1} placeholder="请输入数量" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="unit_price"
          label="单价"
          rules={[{ required: true, message: '请输入单价' }]}
        >
          <InputNumber
            min={0}
            precision={2}
            placeholder="请输入单价"
            style={{ width: '100%' }}
            formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            创建
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProcurementModal;
