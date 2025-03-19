import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SesionesService {
    // private apiUrl = 'https://libreriaocasional.onrender.com/';
    private apiUrl = 'http://localhost:3000/sesiones/';
    private epGetSesiones = 'getSesiones';
    private epAddSesion = 'addSesion';

    constructor(private http: HttpClient) { }

    getLibros(idUsuario: number): Observable<any> {
        const url = `${this.apiUrl}${this.epGetSesiones}/${idUsuario}`;
        return this.http.get(url);
    }

    addSesion(libro: any): Observable<any> {
        const url = `${this.apiUrl}${this.epAddSesion}`;
        return this.http.post(url, libro);
    }
}
