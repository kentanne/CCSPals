import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { FontAwesomeIcon, faTimes, faFile, faEye, faDownload } from '@/components/atoms/SessionIcons';
import { FileItem } from '@/interfaces/session';

interface FileModalProps {
  isOpen: boolean;
  mentorId: string | number | null;
  onClose: () => void;
  initialFiles?: FileItem[];
  styles: any; // Pass the CSS module object
}

export default function FileModal({ isOpen, mentorId, onClose, initialFiles = [], styles }: FileModalProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isFetchingFiles, setIsFetchingFiles] = useState(false);

  useEffect(() => {
    if (isOpen && mentorId) {
      fetchFiles();
    }
  }, [isOpen, mentorId]);

  const fetchFiles = async () => {
    if (!mentorId) return;
    
    setIsFetchingFiles(true);
    try {
      const res = await api.get(`/api/learner/learning-mats/${mentorId}`, { withCredentials: true });
      const fetchedFiles = (res.data?.files || []).map((f: any) => ({
        id: f.id ?? f.file_id ?? f.fileId ?? 0,
        file_name: f.file_name || f.name || f.fileName || '',
        file_id: f.file_id || f.id || '',
        owner_id: f.owner_id ?? String(mentorId),
        webViewLink: f.webViewLink || f.web_view_link || '',
        webContentLink: f.webContentLink || f.web_content_link || ''
      }));
      setFiles(fetchedFiles);
    } catch (err) {
      console.error('Error fetching mentor files:', err);
      setFiles([]);
    } finally {
      setIsFetchingFiles(false);
    }
  };

  const previewFile = async (linkOrId: string) => {
    try {
      if (linkOrId && (linkOrId.startsWith('http://') || linkOrId.startsWith('https://'))) {
        window.open(linkOrId, '_blank');
        return;
      }

      const response = await fetch(`/api/preview/file/${linkOrId}`);
      const data = await response.json();
      if (data?.webViewLink) window.open(data.webViewLink, '_blank');
    } catch (error) {
      console.error('Error previewing file:', error);
    }
  };

  const downloadFile = async (linkOrId: string, fileName?: string) => {
    try {
      if (linkOrId && (linkOrId.startsWith('http://') || linkOrId.startsWith('https://'))) {
        const a = document.createElement('a');
        a.href = linkOrId;
        if (fileName) a.download = fileName;
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const response = await fetch(`/api/download/file/${linkOrId}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (fileName) a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const filteredFiles = files.filter((file: any) => 
    String(file.owner_id) === String(mentorId)
  );

  if (!isOpen) return null;

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h3>Mentor&apos;s Files</h3>
          <button onClick={onClose} className={styles['close-button']}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <div className={styles['modal-body']}>
          {isFetchingFiles ? (
            <div>Loading files...</div>
          ) : (
            <div>
              {filteredFiles.length === 0 ? (
                <div>No files available</div>
              ) : (
                filteredFiles.map((file) => (
                  <div key={file.id} className={styles['file-item']}>
                    <FontAwesomeIcon icon={faFile} className={styles['file-icon']} />
                    <span className={styles['file-name']}>{file.file_name}</span>
                    <div className={styles['file-actions']}>
                      <button
                        className={`${styles['modal-button']} ${styles['preview']}`}
                        onClick={() => previewFile(file.webViewLink || file.file_id)}
                        title="Preview"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        className={`${styles['modal-button']} ${styles['download']}`}
                        onClick={() => downloadFile(file.webContentLink || file.file_id, file.file_name)}
                        title="Download"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}