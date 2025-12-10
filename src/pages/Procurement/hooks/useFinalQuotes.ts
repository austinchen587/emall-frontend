// src/pages/Procurement/hooks/useFinalQuotes.ts
import { useState, useCallback, useEffect } from 'react';
import { procurementApi } from '../../../services/api_procurement';
import { DailyProfitStat } from '../../../services/types/procurement';
import { useAuthStore } from '../../../stores/authStore';

export const useFinalQuotes = (stats: DailyProfitStat[]) => {
  const [finalQuotes, setFinalQuotes] = useState<Record<string, number>>({});
  const [savingQuotes, setSavingQuotes] = useState<Record<string, boolean>>({});
  const [saveTimeouts, setSaveTimeouts] = useState<Record<string, NodeJS.Timeout>>({});
  
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role || '';

  useEffect(() => {
    const initialQuotes: Record<string, number> = {};
    stats.forEach((stat: DailyProfitStat) => {
      initialQuotes[stat.project_name] = stat.final_negotiated_quote || 0;
    });
    setFinalQuotes(initialQuotes);
  }, [stats]);

  const saveFinalQuote = useCallback(async (projectName: string, quote: number) => {
    try {
      setSavingQuotes(prev => ({ ...prev, [projectName]: true }));
      
      const response = await procurementApi.updateFinalQuote({
        project_name: projectName,
        final_quote: quote,
        modified_by: user?.username || 'unknown',
        modified_role: userRole
      });
      
      if (response.success) {
        console.log(`成功保存项目 ${projectName} 的最终报价: ${quote}`);
      } else {
        throw new Error(response.error || '保存失败');
      }
    } catch (err: any) {
      console.error(`保存项目 ${projectName} 的最终报价失败:`, err);
      setFinalQuotes(prev => ({
        ...prev,
        [projectName]: stats.find(s => s.project_name === projectName)?.final_negotiated_quote || 0
      }));
      alert(`保存失败: ${err.message}`);
    } finally {
      setSavingQuotes(prev => ({ ...prev, [projectName]: false }));
    }
  }, [user, userRole, stats]);

  const handleFinalQuoteChange = useCallback((projectName: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setFinalQuotes(prev => ({
      ...prev,
      [projectName]: numValue
    }));

    if (saveTimeouts[projectName]) {
      clearTimeout(saveTimeouts[projectName]);
    }

    const timeoutId = setTimeout(() => {
      saveFinalQuote(projectName, numValue);
    }, 1000);

    setSaveTimeouts(prev => ({
      ...prev,
      [projectName]: timeoutId
    }));
  }, [saveFinalQuote, saveTimeouts]);

  useEffect(() => {
    return () => {
      Object.values(saveTimeouts).forEach(timeout => clearTimeout(timeout));
    };
  }, [saveTimeouts]);

  return {
    finalQuotes,
    savingQuotes,
    handleFinalQuoteChange
  };
};
