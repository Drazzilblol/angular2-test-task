import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import {Columns} from 'app/enums/columns.enum';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {translateTestImport} from 'tests/testTranslationConfig';
import {GridHeaderCellComponent} from '../header-grid-cell/gridHeaderCell.component';
import {GridHeaderComponent} from './gridHeader.component';

describe('string grid header', function() {
    let component: GridHeaderComponent;
    let fixture: ComponentFixture<GridHeaderComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [GridHeaderComponent, GridHeaderCellComponent],
            imports: [translateTestImport, NgbTooltipModule],
            providers: [ColumnManagerService],
        }).overrideComponent(GridHeaderComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(GridHeaderComponent);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        component.columns =
            [
                new Column(Columns.STATUS, '', 'status', 24, {
                    sortable: false,
                    resizable: false,
                }),
                new Column(Columns.TRANSFORMED, Columns.TRANSFORMED, 'transformedText', 280, {
                    sortable: true,
                    resizable: true,
                }),
                new Column(Columns.ORIGIN, Columns.ORIGIN, 'originText', 280, {
                    sortable: true,
                    resizable: true,
                }),
                new Column(Columns.DATE, Columns.DATE, 'parsedDate', 216, {
                    sortable: true,
                    resizable: false,
                    defaultSort: true,
                }),
            ];
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
    });

    describe('component', function() {
        it('check localization', function() {
            const row = fixtureDebug.queryAll(By.css('.content'));
            expect(row[0].nativeElement.innerText).toBe(english.GRID_HEADER['transformed-text-column']);
            expect(row[1].nativeElement.innerText).toBe(english.GRID_HEADER['origin-text-column']);
            expect(row[2].nativeElement.innerText).toBe(english.GRID_HEADER['date-column']);

            translate.use('ru');
            fixture.detectChanges();
            expect(row[0].nativeElement.innerText).toBe(russian.GRID_HEADER['transformed-text-column']);
            expect(row[1].nativeElement.innerText).toBe(russian.GRID_HEADER['origin-text-column']);
            expect(row[2].nativeElement.innerText).toBe(russian.GRID_HEADER['date-column']);
        });
    });
});
