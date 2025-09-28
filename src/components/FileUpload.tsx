import React, { useCallback, useState } from 'react';
import { Upload, FileSpreadsheet, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessage('Please upload a valid Excel file (.xlsx or .xls)');
      setUploadStatus('error');
      return false;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setErrorMessage('File size must be less than 10MB');
      setUploadStatus('error');
      return false;
    }

    return true;
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setErrorMessage('');
    
    if (validateFile(file)) {
      setUploadStatus('success');
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (isProcessing) return;
    handleFiles(e.dataTransfer.files);
  }, [handleFiles, isProcessing]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isProcessing) return;
    handleFiles(e.target.files);
  }, [handleFiles, isProcessing]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : uploadStatus === 'success'
            ? 'border-green-500 bg-green-50'
            : uploadStatus === 'error'
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isProcessing && document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept=".xlsx,.xls"
          onChange={handleChange}
          disabled={isProcessing}
        />
        
        <div className="space-y-4">
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          ) : (
            <div className="relative">
              <Upload className={`w-16 h-16 mx-auto transition-colors ${
                dragActive ? 'text-blue-500' : 'text-gray-400'
              }`} />
              <FileSpreadsheet className="w-8 h-8 text-green-600 absolute -bottom-1 -right-1" />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {uploadStatus === 'success' 
                ? 'File uploaded successfully!' 
                : 'Upload Transportation Data'
              }
            </h3>
            
            {uploadStatus === 'error' ? (
              <p className="text-red-600 font-medium">{errorMessage}</p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-600">
                  Drag and drop your Excel file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports .xlsx and .xls files (max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>
        
        {!isProcessing && uploadStatus !== 'success' && (
          <button className="mt-4 btn-primary">
            Choose File
          </button>
        )}
      </div>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-2">Required Excel Format:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Order Information</strong> sheet with order details</li>
          <li>• <strong>Route Information</strong> sheet with available routes</li>
          <li>• Columns should match the expected data structure</li>
        </ul>
      </div>
    </div>
  );
};