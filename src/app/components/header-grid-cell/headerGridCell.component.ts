import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    Renderer2,
} from '@angular/core';
import {Columns} from 'app/enums/columns.enum';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'header-grid-cell',
    templateUrl: './headerGridCell.template.html',
})
export class HeaderGridCell implements OnInit {

    @Input() public column: Columns;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                private changeDetector: ChangeDetectorRef) {
        columnManager.getObservable().subscribe((options) => {
            if (options.type === 'header') {
                this.changeCell();
            }
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
        this.changeDetector.markForCheck();
    }
}
