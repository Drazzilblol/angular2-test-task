import {CommonModule} from '@angular/common';
import {
    ChangeDetectionStrategy,
    Compiler,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
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
import {StringListItem} from '../string-grid-container/models/StringListItem';

@Component({
    changeDetection: ChangeDetectionStrategy.Default,
    selector: 'strings-grid-cell',
    templateUrl: './stringGridCell.template.html',
})
export class StringsGridCell implements OnInit {

    @Input() public column: Column;
    @Input() public index: number;
    @Input() public item: StringListItem;

    @ViewChild('container', {read: ViewContainerRef})
    public container: ViewContainerRef;

    private componentRef: ComponentRef<{}>;

    constructor(public elementRef: ElementRef, public renderer: Renderer2, public columnManager: ColumnManagerService,
                private componentFactoryResolver: ComponentFactoryResolver,
                private compiler: Compiler) {
        columnManager.getObservable().subscribe((options) => {
            if (options.type === 'body') {
                this.changeCell();
            }
        });
    }

    public ngOnInit(): void {
        this.changeCell();
        this.compileTemplate();
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

    public compileTemplate() {
        const metadata = {
            selector: `cell-item`,
            template: this.column.functionValue(this.item),
        };
        const factory = this.createComponentFactorySync(this.compiler, metadata);
        this.componentRef = this.container.createComponent(factory);
        Object.assign(this.componentRef.instance, {item: this.item});
    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component): ComponentFactory<any> {
        const decoratedCmp = Component(metadata)(class RuntimeComponent {
        });

        @NgModule({
            declarations: [decoratedCmp],
            imports: [CommonModule, PipesModule, NgbTooltipModule, TranslateModule.forChild()],
        })
        class RuntimeComponentModule {
        }

        const module: ModuleWithComponentFactories<any> =
            compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find((f) => f.componentType === decoratedCmp);
    }
}
