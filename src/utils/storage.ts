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

const DB_NAME = "FileCheckDB";
const DB_VERSION = 2;
const FILES_STORE = "files";
const RECORDS_STORE = "records";

class StorageService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // 创建文件存储
        if (!db.objectStoreNames.contains(FILES_STORE)) {
          db.createObjectStore(FILES_STORE, { keyPath: "id" });
        }
        
        // 创建记录存储
        if (!db.objectStoreNames.contains(RECORDS_STORE)) {
          db.createObjectStore(RECORDS_STORE, { keyPath: "id" });
        }
      };
    });
  }

  async saveFiles(files: FileItem[]): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readwrite");
      const store = transaction.objectStore(FILES_STORE);
      
      store.clear();
      
      files.forEach(file => {
        store.add(file);
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getFiles(): Promise<FileItem[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readonly");
      const store = transaction.objectStore(FILES_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearFiles(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([FILES_STORE], "readwrite");
      const store = transaction.objectStore(FILES_STORE);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async saveRecord(record: CheckRecord): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RECORDS_STORE], "readwrite");
      const store = transaction.objectStore(RECORDS_STORE);
      
      store.add(record);
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getRecords(): Promise<CheckRecord[]> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RECORDS_STORE], "readonly");
      const store = transaction.objectStore(RECORDS_STORE);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getRecord(id: string): Promise<CheckRecord | null> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RECORDS_STORE], "readonly");
      const store = transaction.objectStore(RECORDS_STORE);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteRecord(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RECORDS_STORE], "readwrite");
      const store = transaction.objectStore(RECORDS_STORE);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllRecords(): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([RECORDS_STORE], "readwrite");
      const store = transaction.objectStore(RECORDS_STORE);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

export const storageService = new StorageService();
