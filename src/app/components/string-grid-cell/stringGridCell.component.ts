import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {Columns} from 'app/enums/columns.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'strings-grid-cell',
    templateUrl: './stringGridCell.template.html',
})
export class StringsGridCell implements OnInit {

    @Input() public column: Columns;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
        columnManager.getObservable().subscribe(() => {
            this.changeCell();
        });
    }

    public ngOnInit(): void {
        this.changeCell();
    }

    public changeCell(): void {
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-column',
            this.columnManager.getColumn(this.column).position);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-row',
            1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'width',
            this.columnManager.getColumn(this.column).width + 'px');
    }

}
