import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EditorialesService {
    private apiUrl = 'https://libreriaocasional.onrender.com/getEditoriales';

    constructor(private http: HttpClient) { }

    getEditoriales(): Observable<any> {
        const url = `${this.apiUrl}`;
        return this.http.get(url);
    }
}
