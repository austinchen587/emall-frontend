// src/pages/Procurement/components/FinalQuoteInput/FinalQuoteInput.tsx
import React, { useState, useEffect, useCallback } from 'react';
import './FinalQuoteInput.css';

interface FinalQuoteInputProps {
  projectName: string;
  value: string | number;
  saving: boolean;
  canEdit: boolean;
  onChange: (projectName: string, value: string) => void;
}

const FinalQuoteInput: React.FC<FinalQuoteInputProps> = ({
  projectName,
  value,
  saving,
  canEdit,
  onChange
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  // 防抖函数
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  // 防抖后的onChange处理（3秒）
  const debouncedOnChange = useCallback(
    debounce((projectName: string, value: string) => {
      setIsSaving(true);
      onChange(projectName, value);
    }, 3000),
    [onChange]
  );

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(projectName, newValue);
  };

  // 监听saving状态变化
  useEffect(() => {
    if (!saving && isSaving) {
      setIsSaving(false);
    }
  }, [saving, isSaving]);

  // 监听外部value变化
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className="final-quote-container">
      <input
        type="number"
        value={localValue}
        onChange={handleChange}
        placeholder="输入最终报价"
        className="final-quote-input"
        disabled={!canEdit || isSaving}
        min="0"
        step="0.01"
      />
      {isSaving && <span className="saving-indicator visible">保存中...</span>}
    </div>
  );
};

export default FinalQuoteInput;
