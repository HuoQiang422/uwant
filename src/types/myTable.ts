export interface MyTableProps {
  dataKey: string;
  tableKey: number;
  columns: any[];
  onRowClick?: (record: any, event: React.MouseEvent<HTMLElement>) => void;
  params?: any;
  getListUrl?: string;
  getProgress?: string;
  getAttachments?: string;
  onProgressData?: (data: any[]) => void;
  onAttachmentsData?: (data: any[]) => void;
} 