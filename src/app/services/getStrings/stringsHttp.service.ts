import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class StringsHttpService {

    constructor(private http: HttpClient) {
    }

    getStrings() {
        return this.http.get<any>('http://localhost:3000/strings');
    }
}