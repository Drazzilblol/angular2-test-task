import {Component, ViewChild, ViewContainerRef} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {BrowserDynamicTestingModule} from '@angular/platform-browser-dynamic/testing';
import {TranslateService} from '@ngx-translate/core';
import {DatePickerComponent} from 'app/components/datepicker/datePicker.component';
import {DatePickerManagerService} from 'app/services/date-picker-manager/datePickerManager.service';
import {translateTestImport} from 'tests/testTranslationConfig';

describe('date picker manager service', function() {

    @Component({
        template: '<div #container></div>',
    })
    class TestComponent {
        @ViewChild('container', {read: ViewContainerRef})
        public container: ViewContainerRef;

    }

    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let datePickerManagerService: DatePickerManagerService;
    let translate: TranslateService;

    beforeEach(function() {
        TestBed.configureTestingModule({
            imports: [translateTestImport],
            declarations: [TestComponent, DatePickerComponent],
            providers: [DatePickerManagerService],
        }).overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [DatePickerComponent],
            },
        }).compileComponents();

        translate = TestBed.get(TranslateService);
        translate.use('en');
        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        datePickerManagerService = TestBed.get(DatePickerManagerService);
    });

    afterAll(function() {
        datePickerManagerService = null;
        fixture = null;
        component = null;
    });

    it('check is date picker created', function() {
        datePickerManagerService.open(component.container);
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('datepicker'))).not.toBe(null);
    });

    it('check is date picker destroyed', function() {
        datePickerManagerService.open(component.container);
        fixture.detectChanges();
        datePickerManagerService.close(component.container);
        fixture.detectChanges();

        expect(fixture.debugElement.query(By.css('datepicker'))).toBe(null);
    });
});
