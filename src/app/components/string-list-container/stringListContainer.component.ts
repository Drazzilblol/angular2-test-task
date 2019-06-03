import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'string-list-container',
    templateUrl: './stringListContainer.template.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringListContainer {
    stringList: string[] = [];

    deleteItem = (index: number) => this.stringList.splice(index, 1);

    addItem = (string: string) => this.stringList.push(string);

};

