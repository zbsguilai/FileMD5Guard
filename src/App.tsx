import React, { useState, useEffect } from "react";
import { Layout, Card, Typography, Spin, Space, Row, Col, Button } from "antd";
import { FileSearchOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import FileUpload from "./components/FileUpload";
import FileList from "./components/FileList";
import HistoryPanel from "./components/HistoryPanel";
import AppHeader from "./components/AppHeader";
import { useFileDetection } from "./hooks/useFileDetection";

const { Content } = Layout;
const { Title } = Typography;

function App() {
  const [showHistory, setShowHistory] = useState(false); // 首页显示文件上传
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null); // 选中的记录ID
  const {
    currentFiles,
    duplicateGroups,
    historyRecords,
    currentRecordId,
    addFiles,
    clearCurrentFiles,
    clearAllData,
    loadStoredData,
    loadRecord,
    deleteRecord,
    loadRecords
  } = useFileDetection();

  useEffect(() => {
    loadStoredData();
    loadRecords();
  }, [loadStoredData, loadRecords]);

  // 当历史记录加载完成后，默认选择最新的一条记录
  useEffect(() => {
    if (showHistory && historyRecords.length > 0 && !selectedRecordId) {
      const latestRecord = historyRecords[0]; // 已经按时间倒序排列
      setSelectedRecordId(latestRecord.id);
      loadRecord(latestRecord.id);
    }
  }, [showHistory, historyRecords, selectedRecordId, loadRecord]);

  const handleShowHistory = () => {
    setShowHistory(true); // 点击"检验历史"按钮显示历史面板
    setSelectedRecordId(null); // 重置选中记录，让useEffect自动选择最新记录
  };

  const handleShowUpload = () => {
    setShowHistory(false); // 点击"文件上传"按钮显示上传界面
    setSelectedRecordId(null); // 重置选中记录
  };

  const handleFilesProcessed = (files: any[]) => {
    addFiles(files);
  };

  const handleLoadRecord = async (recordId: string) => {
    setSelectedRecordId(recordId);
    await loadRecord(recordId);
  };

  return (
    <Layout className="app-layout">
      <AppHeader 
        onShowHistory={handleShowHistory}
        onShowUpload={handleShowUpload}
        showHistory={showHistory}
      />
      <Content className="app-content">
        <div className="content-container">
          {!showHistory ? (
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <Card className="upload-card">
                  <div className="file-upload-container">
                    <FileUpload onFilesProcessed={handleFilesProcessed} />
                  </div>
                </Card>
              </Col>
              <Col span={24}>
                <FileList 
                  files={currentFiles} 
                  duplicateGroups={duplicateGroups}
                  onClearFiles={clearCurrentFiles}
                  showClearButton={true}
                />
              </Col>
            </Row>
          ) : (
            <Row gutter={[24, 24]} style={{ height: "calc(100vh - 120px)" }}>
              {/* 左侧：历史记录列表 */}
              <Col span={8} style={{ height: "100%" }}>
                <HistoryPanel
                  records={historyRecords}
                  currentRecordId={selectedRecordId}
                  onLoadRecord={handleLoadRecord}
                  onDeleteRecord={deleteRecord}
                  onClearAllData={clearAllData}
                />
              </Col>
              
              {/* 右侧：文件详情 */}
              <Col span={16} style={{ height: "100%" }}>
                {selectedRecordId ? (
                  <div style={{ height: "100%", overflow: "auto" }}>
                    <FileList 
                      files={currentFiles} 
                      duplicateGroups={duplicateGroups}
                      onClearFiles={() => {}} // 历史记录详情页面不显示清空按钮
                      showClearButton={false} // 不显示清空按钮
                    />
                  </div>
                ) : (
                  <Card 
                    className="file-list-card" 
                    style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <div style={{ textAlign: "center", color: "#999" }}>
                      <FileSearchOutlined style={{ fontSize: "48px", marginBottom: "16px" }} />
                      <div>请从左侧选择一条记录查看详情</div>
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
}

export default App;
