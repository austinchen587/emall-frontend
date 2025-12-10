// src/pages/Procurement/components/SearchBox/SearchBox.tsx
import React from 'react';
import './SearchBox.css';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="搜索项目名称、负责人或供应商..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <span className="search-icon">🔍</span>
    </div>
  );
};

export default SearchBox;
