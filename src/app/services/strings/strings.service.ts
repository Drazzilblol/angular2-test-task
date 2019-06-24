import {Injectable} from '@angular/core';
import {StringListItem} from 'app/components/string-grid-container/models/StringListItem';
import {Observable, Subject} from 'rxjs';

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
     * Излучает элемент списка SortParams.
     * @param {StringListItem} stringListItem Излучаемый элемент списка.
     */
    public addString(stringListItem: StringListItem): void {
        this.stringsSource.next(stringListItem);
    }
}
