import {CommonModule} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Compiler,
    Component,
    ComponentFactory,
    ComponentRef,
    ElementRef,
    Input,
    ModuleWithComponentFactories,
    NgModule,
    OnInit,
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {PipesModule} from 'app/pipes/pipes.module';
import {Column} from 'app/services/column-manger-service/column';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';
import {findIndex} from 'lodash';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'grid-cell',
    templateUrl: './gridCell.template.html',
})
export class GridCellComponent implements OnInit {

    @Input() public column: Column;
    @Input() public index: number;
    @Input() public item: any;

    @ViewChild('container', {read: ViewContainerRef})
    public container: ViewContainerRef;

    private componentRef: ComponentRef<{}>;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                private compiler: Compiler) {
        columnManager.getObservable().subscribe((options) => {
            if (options.type === 'body') {
                this.changeWidth();
            }
            if (options.type === 'move') {
                this.changeIndex(findIndex(options.cols, (col) => {
                    return this.column === col;
                }));
            }
        });
    }

    public changeIndex(index: number): void {
        this.index = index;
        this.changePosition();
    }

    public ngOnInit(): void {
        this.changeWidth();
        this.changePosition();
        this.compileTemplate();
    }

    /**
     * Задает ширину ячейки в таблице.
     */
    public changeWidth(): void {
        this.renderer.setStyle(this.elementRef.nativeElement,
            'width',
            this.column.width + 'px');
    }

    /**
     * Задает номер колонки для ячейки в таблице.
     */
    public changePosition(): void {
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

    /**
     * Динамически создает компонент содержащий шаблон возвращенный из Column.functionValue() и привязывает
     * его к контейнеру.
     */
    public compileTemplate() {
        const factory = this.createComponentFactorySync();
        this.componentRef = this.container.createComponent(factory);
        Object.assign(this.componentRef.instance, {item: this.item});
    }

    /**
     * Создает фабрику для динамического создания компонента.
     */
    private createComponentFactorySync(): ComponentFactory<any> {
        const template: string = this.column.functionValue(this.item);

        @Component({
            selector: `cell-item`,
            template,
        })
        class RuntimeComponent {
        }

        @NgModule({
            declarations: [RuntimeComponent],
            imports: [CommonModule, PipesModule, NgbTooltipModule, TranslateModule.forChild()],
        })
        class RuntimeComponentModule {
        }

        const module: ModuleWithComponentFactories<any> =
            this.compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find((factory) => factory.componentType === RuntimeComponent);
    }
}
