import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {translateTestImport} from 'tests/testTranslationConfig';
import {Order} from 'app/enums/order.enum';
import {Sort} from 'app/enums/sort.enum';
import {StringsGridHeader} from './stringGridHeader.component';

describe('string grid header', function() {
    let component: StringsGridHeader;
    let fixture: ComponentFixture<StringsGridHeader>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [StringsGridHeader],
            imports: [translateTestImport],
            providers: [],
        }).overrideComponent(StringsGridHeader, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StringsGridHeader);
        fixtureDebug = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function() {
        fixture = null;
        component = null;
        translate = null;
        fixtureDebug = null;
    });

    describe('component', function() {

        it('check is onSort output emmit value', function() {

            component.onSort.subscribe((params) => {
                expect(params.column).toBe(Sort.TRANSFORMED);
                expect(params.order).toBe(Order.ASC);
            });
            fixtureDebug.queryAll(By.css('.grid-row .header-content'))[1].nativeElement
                .dispatchEvent(new Event('click'));
        });

        it('check localization', function() {
            const row = fixtureDebug.queryAll(By.css('.grid-row .header-content'));
        //    expect(row[1].nativeElement.innerText).toBe(english.STRING_GRID_HEADER.TRANSFORMED_TEXT);
         //   expect(row[2].nativeElement.innerText).toBe(english.STRING_GRID_HEADER.ORIGIN_TEXT);
          //  expect(row[3].nativeElement.innerText).toBe(english.STRING_GRID_HEADER.DATE);

            translate.use('ru');
            fixture.detectChanges();

         //   expect(row[1].nativeElement.innerText).toBe(russian.STRING_GRID_HEADER.TRANSFORMED_TEXT);
          //  expect(row[2].nativeElement.innerText).toBe(russian.STRING_GRID_HEADER.ORIGIN_TEXT);
          //  expect(row[3].nativeElement.innerText).toBe(russian.STRING_GRID_HEADER.DATE);
        });

    });
});
