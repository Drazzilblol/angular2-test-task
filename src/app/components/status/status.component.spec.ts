import {ChangeDetectionStrategy, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateService} from '@ngx-translate/core';
import english from 'app/locales/locale-en.json';
import russian from 'app/locales/locale-ru.json';
import {translateTestImport} from 'tests/testTranslationConfig';
import {Statuses} from '../../enums/statuses.enum';
import {ColorsPipe} from '../../pipes/colors/colors.pipe';
import {StatusComponent} from './status.component';

describe('status', function() {
    let component: StatusComponent;
    let fixture: ComponentFixture<StatusComponent>;
    let translate: TranslateService;
    let fixtureDebug: DebugElement;

    beforeEach(function() {
        TestBed.configureTestingModule({
            declarations: [StatusComponent, ColorsPipe],
            imports: [FormsModule, NgbTooltipModule, translateTestImport],
        }).overrideComponent(StatusComponent, {
            set: {changeDetection: ChangeDetectionStrategy.Default},
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(StatusComponent);
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

        it('check color changing', function() {
            component.status = Statuses.FRESH;
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('div'));

            expect(status.styles['background-color']).toBe('green');

            component.status = Statuses.YESTERDAY;
            fixture.detectChanges();

            expect(status.styles['background-color']).toBe('yellow');

            component.status = Statuses.ROTTEN;
            fixture.detectChanges();

            expect(status.styles['background-color']).toBe('red');
        });

        it('check tooltip', function() {
            component.status = Statuses.FRESH;
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('div')).nativeElement;
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

        it('check tooltip translation', function() {
            component.status = Statuses.FRESH;
            translate.use('ru');
            fixture.detectChanges();
            const status = fixtureDebug.query(By.css('div')).nativeElement;
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
