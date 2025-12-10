// src/pages/Procurement/components/FinalQuoteInput/FinalQuoteInput.tsx
import React from 'react';
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
  return (
    <div className="final-quote-container">
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(projectName, e.target.value)}
        placeholder="输入最终报价"
        className="final-quote-input"
        disabled={!canEdit || saving}
        min="0"
        step="0.01"
      />
      {saving && <span>保存中...</span>}
    </div>
  );
};

export default FinalQuoteInput;
