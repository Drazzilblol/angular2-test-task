import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Statuses} from 'app/enums/statuses.enum';
import {StringsService} from 'app/services/strings/strings.service';
import {now} from 'lodash';
import {StringListItem} from '../string-list/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'string-add',
    templateUrl: './stringAdd.template.html',
})
export class StringAdd implements OnInit {
    public addForm: FormGroup;

    constructor(private stringService: StringsService) {
    }

    public ngOnInit(): void {
        this.addForm = new FormGroup({
            text: new FormControl('', [
                Validators.required,
                Validators.pattern('[\\w\\s\\dА-Яа-я]{3,15}'),
            ]),
        });
    }

    /**
     * Передает строку сервису StringsFilterService для добавления в список.
     */
    public addItem(): void {
        this.stringService.addString(new StringListItem(this.addForm.value.text, new Date(now()), Statuses.FRESH));
    }
}
