import React, {useEffect,useState} from 'react';
import { apiService } from '../services/api';

const ApiTest: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [data,setData] = useState<string>('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const helloResponse = await apiService.getHello();
                setMessage(helloResponse.message);

                const dataResponse = await apiService.getData();
                setData(dataResponse.data);
            } catch (error) {
                console.error('API 调用失败',error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="api-test">
            <h2>Django API 连接测试</h2>
            <p><strong>hello api:</strong>{message}</p>
            <p><strong>data api</strong>{data}</p>

        </div>
    );
};
export default ApiTest;