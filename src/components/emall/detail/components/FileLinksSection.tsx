// src/components/emall/detail/components/FileLinksSection.tsx
import React from 'react';
import { EmallItem } from '../../../../services/types';
import { getSafeArray, hasArrayData } from '../utils/dataHelpers';

interface FileLinksSectionProps {
  project: EmallItem;
}

const FileLinksSection: React.FC<FileLinksSectionProps> = ({ project }) => {
  const renderDownloadFilesWithLinks = () => {
    const files = getSafeArray(project.download_files);
    const links = getSafeArray(project.related_links);
    
    console.log('下载文件数据:', files);
    console.log('相关链接数据:', links);

    // 如果都没有数据
    if (files.length === 0 && links.length === 0) {
      return <div className="no-data">暂无下载文件</div>;
    }

    // 如果文件数量多于链接数量，用文件数量作为基准
    const itemCount = Math.max(files.length, links.length);

    return (
      <div className="download-files">
        {Array.from({ length: itemCount }).map((_, index) => {
          const fileName = files[index] || `文件${index + 1}`;
          const fileLink = links[index] || '#';
          const hasLink = links[index] !== undefined;

          return (
            <div key={index} className="file-item">
              <span className="file-icon">📎</span>
              {hasLink ? (
                <a 
                  href={fileLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="file-link"
                  title={`下载: ${fileName}`}
                >
                  {fileName}
                </a>
              ) : (
                <span className="file-name" title={fileName}>
                  {fileName}
                </span>
              )}
              {hasLink && (
                <span className="link-info" title={fileLink}>
                  {fileLink.length > 40 ? `${fileLink.substring(0, 40)}...` : fileLink}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 只有当有下载文件或相关链接时才显示这个区块
  const hasDownloadData = hasArrayData(project.download_files) || hasArrayData(project.related_links);

  if (!hasDownloadData) {
    return null;
  }

  return (
    <div className="info-section">
      <h4>下载文件</h4>
      {renderDownloadFilesWithLinks()}
    </div>
  );
};

export default FileLinksSection;
