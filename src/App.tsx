// src/App.tsx
import { useState, useEffect } from 'react'
import { dataService } from './services/api/dataService'
import './App.css'

interface User {
  id: number
  name: string
  email: string
  created_at?: string
}

interface HelloResponse {
  message: string
  status: string
}

function App() {
  const [message, setMessage] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // 测试连接
      const helloData: HelloResponse = await dataService.helloWorld()
      console.log('Hello数据:', helloData)
      
      setMessage(helloData.message)
      
      // 获取用户数据
      const userData: User[] = await dataService.getUsers()
      console.log('用户数据:', userData)
      
      setUsers(userData)
      
    } catch (error: any) {
      console.error('获取数据失败:', error)
      if (error.response) {
        setError(`HTTP ${error.response.status}: ${error.response.statusText}`)
      } else {
        setError(error.message || '未知错误')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React + Django 连接测试</h1>
      
      <button 
        onClick={fetchData} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? '加载中...' : '重新获取数据'}
      </button>

      {error && (
        <div style={{ 
          padding: '15px', 
          background: '#ffebee', 
          color: '#c62828', 
          margin: '15px 0',
          border: '1px solid #f44336',
          borderRadius: '4px'
        }}>
          <strong>错误:</strong> {error}
        </div>
      )}

      {message && (
        <div style={{ 
          padding: '15px', 
          background: '#e8f5e8', 
          margin: '15px 0',
          border: '1px solid #4caf50',
          borderRadius: '4px'
        }}>
          <strong>后端消息:</strong> {message}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>用户列表 ({users.length})</h3>
        {loading ? (
          <p>加载中...</p>
        ) : users.length > 0 ? (
          <div style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '10px'
          }}>
            {users.map((user) => (
              <div key={user.id} style={{
                padding: '10px',
                margin: '5px 0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}>
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>姓名:</strong> {user.name}</div>
                <div><strong>邮箱:</strong> {user.email}</div>
                {user.created_at && (
                  <div><strong>创建时间:</strong> {user.created_at}</div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#666' }}>暂无用户数据</p>
        )}
      </div>
    </div>
  )
}

export default App
