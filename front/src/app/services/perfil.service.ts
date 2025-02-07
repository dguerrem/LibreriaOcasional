import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PerfilService {
    private apiUrl = 'http://localhost:3000/getUsuario';

    constructor(private http: HttpClient) { }

    getUsuario(idUsuario: number): Observable<any> {
        const url = `${this.apiUrl}/${idUsuario}`;
        return this.http.get(url);
    }
}
