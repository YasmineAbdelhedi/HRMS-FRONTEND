import { User } from './user.model';

export interface Profile {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    skills: string;
    experience: string;
    employee: User;
}
