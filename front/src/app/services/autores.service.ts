import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutoresService {
    private apiUrl = 'https://libreriaocasional.onrender.com/getAutores';

    constructor(private http: HttpClient) { }

    getAutores(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.http.get(url);
    }
}
