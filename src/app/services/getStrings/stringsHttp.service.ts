import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {StringGridItem} from 'app/components/string-add/models/StringGridItem';
import {map as lodashMap} from 'lodash';
import {map} from 'rxjs/operators';

@Injectable()
export class StringsHttpService {

    constructor(private http: HttpClient) {
    }

    public getStrings() {
        return this.http.get<any>('http://localhost:3000/strings').pipe(map((value) => {
            return lodashMap(value, (item) => {
                return new StringGridItem(item.filter, new Date(item.date), item.status);
            });
        }));
    }
}
