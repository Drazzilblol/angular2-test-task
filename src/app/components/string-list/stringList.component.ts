import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: "strings-list",
    templateUrl: "./stringList.template.html",
})
export class StringList {

    @Input() strings: string[] = [];

    @Output() onDelete: EventEmitter<number> = new EventEmitter<number>();

    deleteItem(index: number) {
        this.onDelete.emit(index);
    }
};


