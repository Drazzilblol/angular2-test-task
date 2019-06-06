import {FormsModule} from '@angular/forms';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {translateTestImport} from 'tests/TestTranslationConfig';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {StatusComponent} from './status.component';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {ChangeDetectionStrategy, SimpleChange} from '@angular/core';
import {Statuses} from './statuses';

describe('status', function () {
    let component: StatusComponent;
    let fixture: ComponentFixture<StatusComponent>;
    let translate: TranslateService;

    beforeEach(function () {
        TestBed.configureTestingModule({
            imports: [FormsModule, NgbTooltipModule, translateTestImport],
            declarations: [StatusComponent],
        }).overrideComponent(StatusComponent, {
            set: { changeDetection: ChangeDetectionStrategy.Default }
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StatusComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterAll(function () {
        fixture = null;
        component = null;
        translate = null;
        jasmine.clock().uninstall();
    });

    describe('component', function () {

        it('check color changing', function () {
            component.status = Statuses.FRESH;
            component.ngOnChanges({
                prop1: new SimpleChange(undefined , Statuses.FRESH, true)
            });
            fixture.detectChanges();
            let status = fixture.nativeElement.querySelector('div');

            expect(status.style.backgroundColor).toBe('green');

            component.status = Statuses.YESTERDAY;
            component.ngOnChanges({
                prop1: new SimpleChange(Statuses.FRESH , Statuses.YESTERDAY, false)
            });
            fixture.detectChanges();

            expect(status.style.backgroundColor).toBe('yellow');

            component.status = Statuses.ROTTEN;
            component.ngOnChanges({
                prop1: new SimpleChange(Statuses.YESTERDAY , Statuses.ROTTEN, false)
            });
            fixture.detectChanges();

            expect(status.style.backgroundColor).toBe('red');
        });

        it('check tooltip', function () {
            component.status = Statuses.FRESH;
            fixture.detectChanges();
            let status = fixture.nativeElement.querySelector('div');
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(english.STATUS.FRESH);

            status.dispatchEvent(new Event('mouseleave'));
            component.status = Statuses.YESTERDAY;
            fixture.detectChanges();
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(english.STATUS.YESTERDAY);

            status.dispatchEvent(new Event('mouseleave'));
            component.status = Statuses.ROTTEN;
            fixture.detectChanges();
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(english.STATUS.ROTTEN);
        });

        it('check tooltip translation', function () {
            component.status = Statuses.FRESH;
            translate.use('ru');
            fixture.detectChanges();
            let status = fixture.nativeElement.querySelector('div');
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(russian.STATUS.FRESH);

            status.dispatchEvent(new Event('mouseleave'));
            component.status = Statuses.YESTERDAY;
            fixture.detectChanges();
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(russian.STATUS.YESTERDAY);

            status.dispatchEvent(new Event('mouseleave'));
            component.status = Statuses.ROTTEN;
            fixture.detectChanges();
            status.dispatchEvent(new Event('mouseenter'));

            expect(document.querySelector('ngb-tooltip-window').textContent).toBe(russian.STATUS.ROTTEN);
        });

    });
});


