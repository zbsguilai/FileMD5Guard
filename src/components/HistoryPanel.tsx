import React from "react";
import { Card, List, Button, Space, Typography, Tag, Popconfirm, Empty } from "antd";
import {
  DeleteOutlined,
  HistoryOutlined,
  EyeOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface CheckRecord {
  id: string;
  name: string;
  uploadTime: string;
  totalFiles: number;
  duplicateFiles: number;
  duplicateGroupCount: number;
  files: any[];
  duplicateGroups: any[];
  createdAt: number;
}

interface HistoryPanelProps {
  records: CheckRecord[];
  currentRecordId: string | null;
  onLoadRecord: (recordId: string) => void;
  onDeleteRecord: (recordId: string) => void;
  onClearAllData: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  records,
  currentRecordId,
  onLoadRecord,
  onDeleteRecord,
  onClearAllData,
}) => {
  console.log("HistoryPanel records:", records);
  console.log("HistoryPanel records.length:", records.length);

  if (records.length === 0) {
    return (
      <Card 
        className="history-panel" 
        title="检验历史"
        style={{ height: "100%" }}
        bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto" }}
      >
        <div className="empty-history">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无历史记录"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="history-panel" 
      title={
        <Space>
          <HistoryOutlined />
          检验历史
          <Tag color="blue" style={{ marginLeft: 8 }}>
            {records.length} 条记录
          </Tag>
        </Space>
      }
      extra={
        <Popconfirm
          title="确定要清空所有数据吗？"
          description="此操作将删除所有历史记录和当前文件，且无法恢复。"
          onConfirm={onClearAllData}
          okText="确定"
          cancelText="取消"
        >
          <Button danger icon={<DeleteOutlined />} size="small">
            清空
          </Button>
        </Popconfirm>
      }
      style={{ height: "100%" }}
      bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto", padding: "12px" }}
    >
      <List
        dataSource={records}
        renderItem={(record) => (
          <List.Item
            className={`history-item ${currentRecordId === record.id ? "active" : ""}`}
            onClick={() => onLoadRecord(record.id)}
            style={{ 
              padding: "12px 8px", 
              marginBottom: "8px",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
            actions={[
              <Popconfirm
                key="delete"
                title="确定要删除这条记录吗？"
                onConfirm={(e) => {
                  e?.stopPropagation();
                  onDeleteRecord(record.id);
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => e?.stopPropagation()}
                  size="small"
                />
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={
                <div className="history-title" style={{ marginBottom: "4px" }}>
                  <Text strong style={{ fontSize: "14px" }}>{record.name}</Text>
                </div>
              }
              description={
                <div className="history-description">
                  <div className="history-stats" style={{ marginBottom: "4px" }}>
                    <Space split={<Text type="secondary" style={{ fontSize: "12px" }}>•</Text>}>
                      <Text type="secondary" style={{ fontSize: "12px" }}>总文件: {record.totalFiles}</Text>
                      <Text type="danger" style={{ fontSize: "12px" }}>
                        重复: {record.duplicateFiles}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>组: {record.duplicateGroupCount}</Text>
                    </Space>
                  </div>
                  <div className="history-time">
                    <Text type="secondary" style={{ fontSize: "11px" }}>
                      {new Date(record.createdAt).toLocaleString()}
                    </Text>
                  </div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default HistoryPanel;
