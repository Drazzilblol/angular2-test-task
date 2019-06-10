import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {StringsFilterRequest} from './stringsFilterRequest';

@Injectable()
export class StringsFilterService {
    private filterSource = new Subject<any>();
    private filterObservable = this.filterSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать элемены списка.
     */
    getObservable(): Observable<any> {
        return this.filterObservable;
    }

    /**
     * Излучает элемент списка StringListItem.
     * @param {StringsFilterRequest} request Излучаемый элемент списка.
     */
    filter(request: any): void {
        this.filterSource.next(request);
    }
}