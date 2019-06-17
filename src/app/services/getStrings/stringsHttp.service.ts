import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class StringsHttpService {

    constructor(private http: HttpClient) {
    }

    public getStrings() {
        return this.http.get<any>('http://localhost:3000/strings');
    }
}
