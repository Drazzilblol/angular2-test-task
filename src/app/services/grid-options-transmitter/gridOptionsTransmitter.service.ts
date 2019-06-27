import {Injectable} from '@angular/core';
import {FilterParams} from 'app/components/filter/models/filterParams';
import {Observable, Subject} from 'rxjs';
import {ColumnOptions} from '../../components/string-grid-column/models/ColumnOptions';

@Injectable()
export class GridOptionsTransmitterService {
    private source = new Subject<ColumnOptions>();
    private observable = this.source.asObservable();

    /**
     * Возвращает Observable, который будет возвращать параметры фильтрации.
     */
    public getObservable(): Observable<ColumnOptions> {
        return this.observable;
    }

    /**
     * Излучает параметры фильтрации.
     * @param options
     */
    public send(options: ColumnOptions): void {
        this.source.next(options);
    }
}
