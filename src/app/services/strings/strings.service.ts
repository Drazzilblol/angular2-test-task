import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {StringListItem} from '../../components/string-list/models/StringListItem';

@Injectable()
export class StringsService {
    private stringsSource = new Subject<StringListItem>();
    private stringsObservable = this.stringsSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать элемены списка.
     */
    public getObservable(): Observable<StringListItem> {
        return this.stringsObservable;
    }

    /**
     * Излучает элемент списка StringListItem.
     * @param {StringListItem} stringListItem Излучаемый элемент списка.
     */
    public addString(stringListItem: StringListItem): void {
        this.stringsSource.next(stringListItem);
    }
}
