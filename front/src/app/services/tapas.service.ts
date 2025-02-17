import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TapasService {
    private apiUrl = 'https://libreriaocasional.onrender.com/getTapas';

    constructor(private http: HttpClient) { }

    getTapas(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.http.get(url);
    }
}
