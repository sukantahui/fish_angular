
export class JobDetail{
  id?: number;
  job_master_id: number;
  employee_id: number;
  material_id: number;
  job_task_id: number;
  material_quantity: number;
  created_at ?: string;
  total?: number;

  constructor() {
  }
}
