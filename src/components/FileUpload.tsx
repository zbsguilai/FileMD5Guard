import React, { useRef } from "react";
import { Upload, Button, message, Progress } from "antd";
import { InboxOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { calculateMD5 } from "../utils/md5Utils";

const { Dragger } = Upload;

interface FileUploadProps {
  onFilesProcessed: (files: any[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesProcessed }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    await processFiles(files);
    // 清空input值，允许重复选择相同文件
    event.target.value = "";
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const processedFiles = [];
      const totalFiles = files.length;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const md5 = await calculateMD5(file);
        
        processedFiles.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          md5,
          uploadTime: Date.now(),
          isDuplicate: false,
        });

        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      onFilesProcessed(processedFiles);
      message.success(`成功处理 ${files.length} 个文件`);
    } catch (error) {
      console.error("文件处理失败:", error);
      message.error("文件处理失败，请重试");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleUpload = async (info: any) => {
    if (info.fileList && info.fileList.length > 0) {
      const files = info.fileList.map((item: any) => item.originFileObj || item).filter(Boolean);
      await processFiles(files);
    }
  };

  return (
    <div>
      <Dragger
        multiple
        showUploadList={false}
        beforeUpload={() => false}
        onChange={handleUpload}
        disabled={uploading}
        style={{ marginBottom: "16px" }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        <p className="ant-upload-hint">
          支持单个或批量上传，支持拖拽上传
        </p>
      </Dragger>

      <div className="upload-actions">
        <Button
          type="primary"
          icon={<CloudUploadOutlined />}
          onClick={handleFileSelect}
          loading={uploading}
          size="large"
        >
          选择文件
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>

      {uploading && (
        <div style={{ marginTop: "16px" }}>
          <Progress percent={progress} status="active" />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
