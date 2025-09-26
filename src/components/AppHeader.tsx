import React from "react";
import { Layout, Typography, Space, Button, Divider } from "antd";
import { 
  FileSearchOutlined, 
  HistoryOutlined,
  CloudUploadOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

const { Header } = Layout;
const { Title, Text } = Typography;

interface AppHeaderProps {
  onShowHistory: () => void;
  onShowUpload: () => void;
  showHistory: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onShowHistory, 
  onShowUpload, 
  showHistory 
}) => {
  return (
    <Header className="app-header">
      <div className="header-content">
        <div className="header-left">
            <div className="logo">
              <FileSearchOutlined style={{ fontSize: "28px", color: "#fff" }} />
            </div>
            <div className="title-section">
              <Title level={3} style={{ color: "#fff", margin: 0 }}>
                文件重复检测工具
              </Title>
            </div>
        </div>
        
        <div className="header-right">
          <Space align="center" size="middle">
            <Button
              type={!showHistory ? "primary" : "default"}
              icon={<CloudUploadOutlined />}
              onClick={onShowUpload}
              className="nav-button"
            >
              上传文件
            </Button>
            <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
            <Button
              type={showHistory ? "primary" : "default"}
              icon={<HistoryOutlined />}
              onClick={onShowHistory}
              className="nav-button"
            >
              校验历史
            </Button>
            <Divider type="vertical" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
            <Button
              type="text"
              icon={<InfoCircleOutlined />}
              className="info-button"
            >
              帮助
            </Button>
          </Space>
        </div>
      </div>
    </Header>
  );
};

export default AppHeader;
