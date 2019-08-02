import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Statuses} from 'app/enums/statuses.enum';
import {GridAddService} from 'app/services/strings/grid-add.service';
import {StringGridItem} from '../grid/models/StringGridItem';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'string-add',
    templateUrl: './stringAdd.template.html',
})
export class StringAddComponent implements OnInit {
    public addForm: FormGroup;

    constructor(private stringService: GridAddService) {
    }

    public ngOnInit(): void {
        this.addForm = new FormGroup({
            text: new FormControl('', [
                Validators.required,
                Validators.pattern('[\\w\\s\\dА-Яа-я]{3,}'),
            ]),
        });
    }

    /**
     * Передает строку сервису GridAddService для добавления в список.
     */
    public addItem(): void {
        this.stringService.addItem(new StringGridItem(this.addForm.value.text, new Date(), Statuses.FRESH));
    }
}
