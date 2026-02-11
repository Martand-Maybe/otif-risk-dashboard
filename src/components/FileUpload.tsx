import React, { useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { parseCSV, type OTIFData } from '../utils/csvParser';

interface FileUploadProps {
  onDataLoaded: (data: OTIFData[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const data = await parseCSV(file);
        // Simple validation to check if it has the right structure
        if (data.length > 0 && data[0].SalesOrder !== undefined) {
             onDataLoaded(data);
        } else {
            alert('Invalid CSV format. Please ensure it matches the OTIF template.');
        }
       
      } catch (error) {
        console.error('Error parsing CSV:', error);
        alert('Failed to parse CSV file.');
      }
    }
  }, [onDataLoaded]);

  return (
    <div className="upload-container">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="file-input"
      />
      <div className="upload-icon-circle">
        <UploadCloud size={32} />
      </div>
      <h3 className="upload-title">Upload OTIF CSV</h3>
      <p className="upload-desc">
        Drag and drop your CSV file here, or click to browse.
        <br />
        Compatible with standard OTIF export format.
      </p>
    </div>
  );
};
