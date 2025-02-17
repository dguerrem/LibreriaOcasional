import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutentificacionService {
    private apiUrl = 'https://libreriaocasional.onrender.com/login';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<any> {
        const body = { email, password };
        return this.http.post(this.apiUrl, body);
    }
}
