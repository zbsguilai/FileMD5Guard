import React from "react";
import { Table, Card, Button, Space, Tag, Typography, Statistic, Row, Col } from "antd";
import { DeleteOutlined, FileTextOutlined } from "@ant-design/icons";
import { formatBytes } from "../utils/md5Utils";

const { Text } = Typography;

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  md5: string;
  uploadTime: number;
  isDuplicate: boolean;
  duplicateGroup?: string;
}

interface DuplicateGroup {
  md5: string;
  files: FileItem[];
}

interface FileListProps {
  files: FileItem[];
  duplicateGroups: DuplicateGroup[];
  onClearFiles: () => void;
  showClearButton?: boolean; // 新增：控制是否显示清空按钮
}

const FileList: React.FC<FileListProps> = ({ files, duplicateGroups, onClearFiles, showClearButton = true }) => {
  if (files.length === 0) {
    return (
      <Card className="empty-state-card">
        <div className="empty-state">
          <FileTextOutlined style={{ fontSize: "48px", color: "#d9d9d9" }} />
          <div>
            <Text type="secondary">暂无文件，请先上传文件</Text>
          </div>
        </div>
      </Card>
    );
  }

  const columns = [
    {
      title: "文件名",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: FileItem) => (
        <div>
          <Text strong={record.isDuplicate} style={{ color: record.isDuplicate ? "#ff4d4f" : "inherit" }}>
            {text}
          </Text>
          {record.isDuplicate && (
            <Tag color="red">
              重复
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      render: (size: number) => formatBytes(size),
      sorter: (a: FileItem, b: FileItem) => a.size - b.size,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => type || "未知",
    },
    {
      title: "修改时间",
      dataIndex: "lastModified",
      key: "lastModified",
      render: (timestamp: number) => new Date(timestamp).toLocaleString(),
      sorter: (a: FileItem, b: FileItem) => a.lastModified - b.lastModified,
    },
    {
      title: "MD5",
      dataIndex: "md5",
      key: "md5",
      render: (md5: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {md5.substring(0, 8)}...
        </Text>
      ),
    },
  ];

  const duplicateCount = files.filter(file => file.isDuplicate).length;
  const duplicateGroupCount = duplicateGroups.length;

  return (
    <Card className="file-list-card" title="文件列表">
      <div className="file-stats">
        <Row gutter={16}>
          <Col span={6}>
            <Statistic title="总文件数" value={files.length} />
          </Col>
          <Col span={6}>
            <Statistic 
              title="重复文件" 
              value={duplicateCount} 
              valueStyle={{ color: duplicateCount > 0 ? "#ff4d4f" : "#52c41a" }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="重复组数" 
              value={duplicateGroupCount} 
              valueStyle={{ color: duplicateGroupCount > 0 ? "#ff4d4f" : "#52c41a" }}
            />
          </Col>
          <Col span={6}>
            <Statistic title="唯一文件" value={files.length - duplicateCount} />
          </Col>
        </Row>
      </div>

      {duplicateGroups.length > 0 && (
        <div className="duplicate-groups">
          <Text strong style={{ color: "#ff4d4f", marginBottom: "12px", display: "block" }}>
            重复文件组：
          </Text>
          {duplicateGroups.map((group, groupIndex) => (
            <div key={group.md5} className="duplicate-group">
              <Text strong>组 {groupIndex + 1} (MD5: {group.md5.substring(0, 8)}...)</Text>
              <div style={{ marginTop: "8px" }}>
                {group.files.map((file, fileIndex) => (
                  <div key={file.id} style={{ marginBottom: "4px" }}>
                    <Text>{file.name}</Text>
                    <Text type="secondary" style={{ marginLeft: "8px" }}>
                      ({formatBytes(file.size)})
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Table
        columns={columns}
        dataSource={files}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        rowClassName={(record) => (record.isDuplicate ? "duplicate-row" : "")}
        scroll={{ x: 800 }}
      />

      {showClearButton && (
        <div style={{ marginTop: "16px", textAlign: "right" }}>
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={onClearFiles}
          >
            清空文件列表
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FileList;
