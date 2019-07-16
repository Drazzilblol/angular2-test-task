import {fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Columns} from 'app/enums/columns.enum';
import {ResizeEdges} from 'app/enums/resizeEdges.enum';
import {Subscription} from 'rxjs';
import {Column} from './column';
import {ColumnManagerService} from './columnManager.service';

describe('column manager service', function() {
    let columnManager: ColumnManagerService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            providers: [ColumnManagerService],
        });

        columnManager = TestBed.get(ColumnManagerService);
    });

    afterAll(function() {
        columnManager = null;
    });

    it('check is service returns columns list', function() {
        const testColumn: Column = new Column(Columns.ORIGIN, 'test', 800);
        columnManager.addColumn(testColumn);
        expect(columnManager.getColumns()[0]).toBe(testColumn);
    });

    it('check columns width recalculating', fakeAsync(function() {
        const testColumn1: Column = new Column(Columns.ORIGIN, 'test1', 400,
            {
                sortable: true,
                resizable: true,
            });
        const testColumn2: Column = new Column(Columns.ORIGIN, 'test2', 400,
            {
                sortable: true,
                resizable: false,
            });
        columnManager.addColumn(testColumn1);
        columnManager.addColumn(testColumn2);

        let subscription: Subscription = columnManager.getObservable().subscribe((result: any) => {
            expect(result.type).toBe('header');
            const columns: Column[] = columnManager.getColumns();
            expect(columns[0].width).toBe(420);
            expect(columns[1].width).toBe(380);
        });

        columnManager.changeHeaderWidth(0, 420, ResizeEdges.RIGHT);
        tick(50);
        subscription.unsubscribe();

        subscription = columnManager.getObservable().subscribe((result: any) => {
            expect(result.type).toBe('body');
        });

        columnManager.changeBodyWidth();
        tick(50);
        subscription.unsubscribe();
    }));
});
