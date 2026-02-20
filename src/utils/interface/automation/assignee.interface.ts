export interface Assignee {
  operator_id: number;
  operator_full_name: string;
  operator_weekly_count?: number;
  email?: string;
  desk_id: number;
  desk_name: string;
  manager_operator_id: number;
  user_operator_id: number;
  manager_operator_full_name: string;
  manager_operator_email?: string;
  operator_desk_relation_id?: number;
}
