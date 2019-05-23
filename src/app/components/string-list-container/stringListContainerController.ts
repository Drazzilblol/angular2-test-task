'use strict';

import {Component} from '@angular/core';

@Component({
    selector: 'string-list-container',
    templateUrl: './stringListContainerTemplate.html',
})
export class StringListContainer {
    stringList = [];

    deleteItem = index => this.stringList.splice(index, 1);

    addItem = string => this.stringList.push(string);

};

