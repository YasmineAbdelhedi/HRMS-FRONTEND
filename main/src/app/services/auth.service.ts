import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, map, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoginUserDto, LoginResponse, RegisterUserDto, User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'authToken';
  private currentUserSubject: BehaviorSubject<string | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<string | null>(localStorage.getItem(this.tokenKey));
  }

  // Get the current user details from localStorage
  public get currentUserValue(): string | null {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginUserDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).pipe(
      tap(response => {
        if (response.token) {
          this.saveToken(response.token);
        }
      })
    );
  }

  signup(registerData: RegisterUserDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/signup`, registerData);
  }

  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.currentUserSubject.next(token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  decodeToken(): any {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const payload = token.split('.')[1];
      if (!payload) {
        return null;
      }

      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - normalized.length % 4) % 4), '=');

      try {
        return JSON.parse(atob(padded));
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get user roles directly from the decoded token
  getUserRoles(): string[] {
    const decodedToken = this.decodeToken();
    if (!decodedToken) return [];

    if (decodedToken.roles) {
      return this.normalizeRoles(this.pick(decodedToken.roles));
    }

    if (decodedToken.authorities) {
      return this.normalizeRoles(this.pick(decodedToken.authorities));
    }

    if (decodedToken.user && decodedToken.user.roles) {
      return this.normalizeRoles(this.pick(decodedToken.user.roles));
    }

    if (decodedToken.role && typeof decodedToken.role === 'string') {
      return this.normalizeRoles([decodedToken.role]);
    }

    return [];
  }

  getDefaultRouteByRole(): string {
    return this.mapRolesToRoute(this.getUserRoles());
  }

  resolvePostLoginRoute(): Observable<string> {
    const tokenRoute = this.mapRolesToRoute(this.getUserRoles());
    if (tokenRoute !== '/authentication/login') {
      return of(tokenRoute);
    }

    return this.http.get<User>(`${environment.apiUrl}/users/current`).pipe(
      map((user) => this.mapRolesToRoute(this.extractRolesFromUser(user))),
      catchError(() => of('/authentication/login'))
    );
  }

  private extractRolesFromUser(user: User | any): string[] {
    if (!user) {
      return [];
    }

    if (Array.isArray(user.roles)) {
      return this.normalizeRoles(this.pick(user.roles));
    }

    if (Array.isArray(user.authorities)) {
      return this.normalizeRoles(this.pick(user.authorities));
    }

    return [];
  }

  private mapRolesToRoute(roles: string[]): string {
    if (roles.includes('ADMIN')) {
      return '/admin';
    }

    if (roles.includes('HR_MANAGER')) {
      return '/hr';
    }

    if (roles.includes('PROJECT_MANAGER')) {
      return '/pm';
    }

    if (roles.includes('EMPLOYEE')) {
      return '/employee';
    }

    return '/authentication/login';
  }

  private pick(arr: any[]): string[] {
    if (!Array.isArray(arr)) return [];
    return arr.map((r) => {
      if (!r && r !== 0) return r;
      if (typeof r === 'string') return r;
      if (typeof r === 'object') {
        if (r.name) return r.name;
        if (r.role) return r.role;
        if (r.authority) return r.authority;
      }
      return undefined as unknown as string;
    }).filter(Boolean) as string[];
  }

  private normalizeRoleString(role: string): string {
    if (!role || typeof role !== 'string') return role;
    let r = role.trim();
    if (r.startsWith('ROLE_')) r = r.substring(5);
    return r.toUpperCase();
  }

  private normalizeRoles(roles: string[]): string[] {
    if (!Array.isArray(roles)) return [];
    return roles
      .filter(Boolean)
      .map((r) => this.normalizeRoleString(String(r)));
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/authentication/login']);
  }
}
