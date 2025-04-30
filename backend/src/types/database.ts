import { QueryResult } from 'pg';

export interface Task {
  id: number;
  text: string;
  created_at: Date;
}

export interface QueryResultRow {
  rows: Task[];
  rowCount: number;
  command: string;
  oid: number;
  fields: any[];
}

export type TaskQueryResult = QueryResult<Task>; 