import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Statuses} from 'app/enums/statuses.enum';
import {FilterService} from 'app/services/filter/filter.service';

const NOT_SELECTED: string = 'NOT_SELECTED';
const statusesMap = {
    [NOT_SELECTED]: null,
    [Statuses.FRESH]: Statuses.FRESH,
    [Statuses.YESTERDAY]: Statuses.YESTERDAY,
    [Statuses.ROTTEN]: Statuses.ROTTEN,
};

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'filter',
    templateUrl: './filter.template.html',
})
export class FilterComponent implements OnInit {
    public isOpen = false;
    public statuses = Object.keys(statusesMap);
    public filterForm: FormGroup;

    constructor(private filterService: FilterService) {
    }

    public ngOnInit(): void {
        this.filterForm = new FormGroup({
            filterString: new FormControl('', [
                Validators.pattern('[\\w\\s\\dА-Яа-я]{0,10}'),
            ]),
            statusSelect: new FormControl(NOT_SELECTED),
        });
    }

    /**
     * Передает сервису параметры для фильтрации.
     */
    public filter(): void {
        this.filterService.filter({
            status: statusesMap[this.filterForm.value.statusSelect],
            originText: this.filterForm.value.filterString,
        });
    }

    /**
     * Сбрасывает параметры фильтрации.
     */
    public resetFilter(): void {
        const filterFormValue = this.filterForm;
        filterFormValue.controls.statusSelect.setValue(NOT_SELECTED);
        filterFormValue.controls.filterString.setValue('');
        this.filterService.filter({});
    }

    /**
     * Сворачивает или разворачивает SideNav.
     */
    public toggle(): void {
        this.isOpen = !this.isOpen;
    }
}
