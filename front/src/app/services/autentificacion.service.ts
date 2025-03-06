import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutentificacionService {
    private apiUrl = 'http://localhost:3000/autenticacion/';
    private epLogin = 'login';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        const url = `${this.apiUrl}${this.epLogin}`;
        const body = { email, password };
        return this.http.post(url, body);
    }
}
