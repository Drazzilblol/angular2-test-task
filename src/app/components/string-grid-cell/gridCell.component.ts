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
                this.changeCell();
            }
            if (options.type === 'swap') {
                if (options.fIndex === this.index) {
                    this.changeIndex(options.sIndex);
                } else if (options.sIndex === this.index) {
                    this.changeIndex(options.fIndex);
                }
            }
        });
    }

    public changeIndex(index: number): void {
        this.index = index;
        this.changeCell();
    }

    public ngOnInit(): void {
        this.changeCell();
        this.compileTemplate();
    }

    /**
     * Задает ширину и номер ячейки в таблице.
     */
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
