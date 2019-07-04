import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {Column} from '../../services/column-manger-service/column';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'header-grid-cell',
    templateUrl: './headerGridCell.template.html',
})
export class HeaderGridCell implements OnInit {

    @Input() public column: Column;
    @Input() public index: number;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService) {
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
            'width',
            this.column.width + 'px');
        this.renderer.setStyle(this.elementRef.nativeElement,
            '-ms-grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            '-ms-grid-row',
            1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-column',
            this.index + 1);
        this.renderer.setStyle(this.elementRef.nativeElement,
            'grid-row',
            1);
    }
}
