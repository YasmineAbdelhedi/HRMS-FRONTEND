import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private baseUrl = `${environment.apiUrl}/api/profiles`;

    constructor(private http: HttpClient) { }

    getAllProfiles(): Observable<Profile[]> {
        return this.http.get<Profile[]>(this.baseUrl);
    }

    getProfileById(id: number): Observable<Profile> {
        return this.http.get<Profile>(`${this.baseUrl}/${id}`);
    }

    createProfile(profile: Profile): Observable<Profile> {
        return this.http.post<Profile>(this.baseUrl, profile);
    }

    updateProfile(id: number, profile: Profile): Observable<Profile> {
        return this.http.put<Profile>(`${this.baseUrl}/${id}`, profile);
    }

    deleteProfile(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
