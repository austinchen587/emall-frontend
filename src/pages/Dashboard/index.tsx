import React from 'react';
import { Card, Alert } from 'antd';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>数据看板</h1>
      <Card>
        <Alert 
          message="数据看板开发中..." 
          description="该功能正在积极开发中，即将推出！" 
          type="info" 
          showIcon 
        />
      </Card>
    </div>
  );
};

export default Dashboard;
