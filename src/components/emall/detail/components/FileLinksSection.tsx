// src/components/emall/detail/components/FileLinksSection.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { getSafeArray, hasArrayData } from '../utils/dataHelpers';

interface FileLinksSectionProps {
  project: EmallItem;
}

const FileLinksSection: React.FC<FileLinksSectionProps> = ({ project }) => {
  const renderDownloadFiles = () => {
    const files = getSafeArray(project.download_files);
    
    if (files.length === 0) {
      return <div className="no-data">暂无下载文件</div>;
    }

    return (
      <div className="download-files">
        {files.map((file, index) => (
          <div key={index} className="file-item">
            <span className="file-icon">📎</span>
            <span className="file-name">{file}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderRelatedLinks = () => {
    const links = getSafeArray(project.related_links);
    
    if (links.length === 0) {
      return <div className="no-data">暂无相关链接</div>;
    }

    return (
      <div className="related-links">
        {links.map((link, index) => (
          <div key={index} className="link-item">
            <span className="link-icon">🔗</span>
            <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link-url"
              title={link}
            >
              {link.length > 50 ? `${link.substring(0, 50)}...` : link}
            </a>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {hasArrayData(project.related_links) && (
        <div className="info-section">
          <h4>相关链接</h4>
          {renderRelatedLinks()}
        </div>
      )}
      
      {hasArrayData(project.download_files) && (
        <div className="info-section">
          <h4>下载文件</h4>
          {renderDownloadFiles()}
        </div>
      )}
    </>
  );
};

export default FileLinksSection;
