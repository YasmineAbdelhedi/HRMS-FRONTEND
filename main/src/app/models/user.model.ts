export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
  authority: string;
}

export interface GrantedAuthority {
  authority: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  roles: Role[];
  createdAt?: string;
  updatedAt?: string;
  enabled: boolean;
  username: string;
  authorities?: GrantedAuthority[];
  accountNonLocked?: boolean;
  credentialsNonExpired?: boolean;
  accountNonExpired?: boolean;
}

export interface RegisterUserDto {
  email: string;
  password: string;
  fullName: string;
  roles: string[];
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}