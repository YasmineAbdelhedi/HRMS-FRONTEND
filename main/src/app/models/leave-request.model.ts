import { User } from './user.model';

export interface LeaveRequest {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  status: LeaveStatus;
  employee: User;
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}