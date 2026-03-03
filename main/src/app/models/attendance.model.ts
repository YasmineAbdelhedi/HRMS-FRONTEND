import { User } from './user.model';

export interface Attendance {
  id: number;
  checkInTime: string;
  checkOutTime: string;
  employee: User;
}
