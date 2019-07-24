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
    Renderer2,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';
import {AbstractGridCellComponent} from 'app/components/grid/abstract-grid-cell/abstractGridCell.component';
import {IGridItem} from 'app/components/string-add/models/IGridItem';
import {PipesModule} from 'app/pipes/pipes.module';
import {ColumnManagerService} from 'app/services/column-manger-service/columnManager.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'grid-cell',
    templateUrl: './gridCell.template.html',
})
export class GridCellComponent extends AbstractGridCellComponent {

    @Input() public item: IGridItem;

    @ViewChild('container', {read: ViewContainerRef})
    private container: ViewContainerRef;

    private componentRef: ComponentRef<{}>;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                private compiler: Compiler) {
        super(elementRef, renderer, columnManager);
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.compileTemplate();
    }

    /**
     * Динамически создает компонент содержащий шаблон возвращенный из Column.functionValue() и привязывает
     * его к контейнеру.
     */
    private compileTemplate() {
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
            changeDetection: ChangeDetectionStrategy.OnPush,
            selector: `cell-item`,
            template,
        })
        class RuntimeComponent {
            @Input() public item: IGridItem;
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
