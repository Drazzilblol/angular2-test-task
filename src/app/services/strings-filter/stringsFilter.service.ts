import {Injectable} from '@angular/core';
import {FilterParams} from 'app/components/filter/models/filterParams';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class StringsFilterService {
    private filterSource = new Subject<FilterParams>();
    private filterObservable = this.filterSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать параметры фильтрации.
     */
    public getObservable(): Observable<FilterParams> {
        return this.filterObservable;
    }

    /**
     * Излучает параметры фильтрации.
     * @param {any} params Излучаемые параметры.
     */
    public filter(params: FilterParams): void {
        this.filterSource.next(params);
    }
}
