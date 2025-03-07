import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AutoresService {
    private apiUrl = 'http://localhost:3000/autores/getAutores';

    constructor(private http: HttpClient) { }

    getAutores(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.http.get(url);
    }
}
