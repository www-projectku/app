export type SqlDialect = 'mysql' | 'postgres' | 'prisma' | 'firebase' | 'seed';

export type SystemFocusMode = 'stock_opname' | 'company_profile';

export interface ColumnDefinition {
  name: string;
  type: string;
  keyType: 'PK' | 'FK' | 'UNIQUE' | 'INDEX' | 'NONE';
  nullable: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
  description: string;
  normalizationRole?: string;
}

export interface TableDefinition {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'core' | 'catalog' | 'interaction' | 'auth' | 'inventory' | 'audit';
  badgeColor: string;
  columns: ColumnDefinition[];
  sampleRowsCount: number;
}

export interface ErdRelation {
  id: string;
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  cardinality: '1:N' | '1:1' | 'N:M';
  label: string;
}

export interface SimulatedRow {
  [key: string]: any;
}

export interface PrebuiltQuery {
  id: string;
  title: string;
  description: string;
  targetTable: string;
  sql: string;
  explanation: string;
}

export interface ProductItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
  min_stock: number;
  current_stock: number;
  purchase_price: number;
  location_rack: string;
}

export interface StockTransactionRecord {
  id: number;
  trx_number: string;
  type: 'IN' | 'OUT';
  product_id: number;
  product_name: string;
  quantity: number;
  partner_name: string;
  notes: string;
  date: string;
}

export interface StockOpnameItem {
  id: number;
  product_id: number;
  product_name: string;
  sku: string;
  system_stock: number;
  physical_stock: number;
  difference: number;
  reason: string;
  status: 'matched' | 'deficit' | 'surplus';
}

