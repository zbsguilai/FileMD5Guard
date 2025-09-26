import { useState, useCallback, useEffect } from "react";
import { storageService } from "../utils/storage";

// 定义类型
export interface FileItem {
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

export interface DuplicateGroup {
  md5: string;
  files: FileItem[];
}

export interface CheckRecord {
  id: string;
  name: string;
  uploadTime: string;
  totalFiles: number;
  duplicateFiles: number;
  duplicateGroupCount: number;
  files: FileItem[];
  duplicateGroups: DuplicateGroup[];
  createdAt: number;
}

export const useFileDetection = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<CheckRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<CheckRecord | null>(null);

  const detectDuplicates = useCallback((fileList: FileItem[]) => {
    const md5Map = new Map<string, FileItem[]>();
    
    fileList.forEach(file => {
      if (!md5Map.has(file.md5)) {
        md5Map.set(file.md5, []);
      }
      md5Map.get(file.md5)!.push(file);
    });

    const updatedFiles = fileList.map(file => {
      const group = md5Map.get(file.md5)!;
      return {
        ...file,
        isDuplicate: group.length > 1,
        duplicateGroup: group.length > 1 ? file.md5 : undefined,
      };
    });

    const duplicates: DuplicateGroup[] = [];
    md5Map.forEach((groupFiles, md5) => {
      if (groupFiles.length > 1) {
        duplicates.push({
          md5,
          files: groupFiles.map(file => ({
            ...file,
            isDuplicate: true,
            duplicateGroup: md5,
          })),
        });
      }
    });

    return { updatedFiles, duplicateGroups: duplicates };
  }, []);

  const addFiles = useCallback(async (newFiles: FileItem[]) => {
    setLoading(true);
    try {
      const { updatedFiles, duplicateGroups } = detectDuplicates(newFiles);
      
      setFiles(updatedFiles);
      setDuplicateGroups(duplicateGroups);
      
      // 创建新的检验记录
      const recordId = `record-${Date.now()}`;
      const uploadTime = new Date().toISOString();
      const recordName = new Date(uploadTime).toLocaleString();
      const createdAt = Date.now();
      
      const duplicateStats = duplicateGroups.reduce((acc, group) => {
        acc.totalDuplicates += group.files.length;
        acc.uniqueGroups += 1;
        return acc;
      }, { totalDuplicates: 0, uniqueGroups: 0 });

      const record: CheckRecord = {
        id: recordId,
        name: recordName,
        uploadTime,
        totalFiles: updatedFiles.length,
        duplicateFiles: duplicateStats.totalDuplicates,
        duplicateGroupCount: duplicateStats.uniqueGroups,
        files: updatedFiles,
        duplicateGroups: duplicateGroups,
        createdAt,
      };

      setCurrentRecord(record);
      await storageService.saveRecord(record);
      await loadRecords();
    } catch (error) {
      console.error("Error adding files:", error);
    } finally {
      setLoading(false);
    }
  }, [detectDuplicates]);

  const loadRecords = useCallback(async () => {
    try {
      const records = await storageService.getRecords();
      setRecords(records.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime()));
    } catch (error) {
      console.error("Error loading records:", error);
    }
  }, []);

  const loadRecord = useCallback(async (recordId: string) => {
    try {
      const record = await storageService.getRecord(recordId);
      if (record) {
        setCurrentRecord(record);
        setFiles(record.files);
        setDuplicateGroups(record.duplicateGroups);
      }
    } catch (error) {
      console.error("Error loading record:", error);
    }
  }, []);

  const deleteRecord = useCallback(async (recordId: string) => {
    try {
      await storageService.deleteRecord(recordId);
      await loadRecords();
      
      // 如果删除的是当前记录，清空显示
      if (currentRecord && currentRecord.id === recordId) {
        setCurrentRecord(null);
        setFiles([]);
        setDuplicateGroups([]);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  }, [currentRecord]);

  const clearAllData = useCallback(async () => {
    setLoading(true);
    try {
      await storageService.clearFiles();
      await storageService.clearAllRecords();
      setFiles([]);
      setDuplicateGroups([]);
      setCurrentRecord(null);
      setRecords([]);
    } catch (error) {
      console.error("Error clearing data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearCurrentFiles = useCallback(async () => {
    setLoading(true);
    try {
      await storageService.clearFiles();
      setFiles([]);
      setDuplicateGroups([]);
      setCurrentRecord(null);
    } catch (error) {
      console.error("Error clearing current files:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStoredData = useCallback(async () => {
    try {
      const records = await storageService.getRecords();
      if (records.length > 0) {
        // 加载最新的记录
        const latestRecord = records.sort((a, b) => new Date(b.uploadTime).getTime() - new Date(a.uploadTime).getTime())[0];
        setCurrentRecord(latestRecord);
        setFiles(latestRecord.files);
        setDuplicateGroups(latestRecord.duplicateGroups);
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      await loadRecords();
      await loadStoredData();
    };
    initializeData();
  }, [loadRecords, loadStoredData]);

  return {
    currentFiles: files,
    duplicateGroups,
    loading,
    historyRecords: records,
    currentRecordId: currentRecord?.id || null,
    addFiles,
    clearCurrentFiles,
    clearAllData,
    loadStoredData,
    loadRecord,
    deleteRecord,
    loadRecords,
  };
};
