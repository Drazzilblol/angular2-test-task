import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map as lodashMap} from 'lodash';
import {map} from 'rxjs/operators';
import {StringListItem} from '../../components/grid/models/StringListItem';

@Injectable()
export class StringsHttpService {

    constructor(private http: HttpClient) {
    }

    public getStrings() {
        return this.http.get<any>('http://localhost:3000/strings').pipe(map((value) => {
            return lodashMap(value, (item) => {
                return new StringListItem(item.text, new Date(item.date), item.status);
            });
        }));
    }
}
