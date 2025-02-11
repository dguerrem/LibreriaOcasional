import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EstadosService {
    private apiUrl = 'http://localhost:3000/getEstados';

    constructor(private http: HttpClient) { }

    getEstados(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.http.get(url);
    }
}
