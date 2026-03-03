import { User } from './user.model';

export interface Payroll {
    id: number;
    salary: number;
    paymentDate: string;
    employee: User;
}
