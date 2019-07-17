import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable()
export class FilterService {
    private filterSource = new Subject<any>();
    private filterObservable = this.filterSource.asObservable();

    /**
     * Возвращает Observable, который будет возвращать параметры фильтрации.
     */
    public getObservable(): Observable<any> {
        return this.filterObservable;
    }

    /**
     * Излучает параметры фильтрации.
     * @param {any} params Излучаемые параметры.
     */
    public filter(params: any): void {
        this.filterSource.next(params);
    }
}
