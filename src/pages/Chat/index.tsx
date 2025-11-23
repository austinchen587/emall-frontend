import React from 'react';
import { Card, Alert } from 'antd';

const Chat: React.FC = () => {
  return (
    <div>
      <h1>智能聊天</h1>
      <Card>
        <Alert 
          message="聊天功能开发中" 
          description="该功能正在积极开发中，即将推出！" 
          type="info" 
          showIcon 
        />
      </Card>
    </div>
  );
};

export default Chat;
