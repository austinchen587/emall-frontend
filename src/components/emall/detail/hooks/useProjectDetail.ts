// src/components/emall/detail/hooks/useProjectDetail.ts
import { useState, useEffect } from 'react';
import { EmallItem } from '../../../../services/types';
import { emallApi } from '../../../../services/api_emall';

export const useProjectDetail = (isOpen: boolean, initialProject: EmallItem | null) => {
  const [project, setProject] = useState<EmallItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetail = async () => {
      if (!isOpen || !initialProject) {
        setProject(null);
        return;
      }

      setProject(initialProject);
      setLoading(true);
      setError(null);

      try {
        console.log(`开始获取项目 ${initialProject.id} 的详细数据`);
        const response = await emallApi.getEmallDetail(initialProject.id);
        console.log('获取到的详细项目数据:', response.data);
        setProject(response.data);
      } catch (err) {
        console.error('获取项目详情失败:', err);
        setError('获取项目详情失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetail();
  }, [isOpen, initialProject]);

  useEffect(() => {
    if (!isOpen) {
      setProject(null);
      setLoading(false);
      setError(null);
    }
  }, [isOpen]);

  return { project, loading, error };
};
