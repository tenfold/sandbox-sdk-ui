/* SOURCE: https://github.com/angular/angular/issues/2451#issuecomment-333675976
    Proposed to Angular: https://github.com/angular/angular/pull/25472
    TODO: move to https://github.com/ngrx-utils/ngrx-utils#nglet-directive after migrating to NgRX
*/

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  ngLet: T;
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[ngLet]',
})
export class NgLetDirective<T> {
  // @ts-ignore strictNullChecks
  private context: LetContext<T> = { ngLet: null };

  constructor(viewContainer: ViewContainerRef, templateRef: TemplateRef<LetContext<T>>) {
    viewContainer.createEmbeddedView(templateRef, this.context);
  }

  @Input()
  set ngLet(value: T) {
    this.context.ngLet = value;
  }
}
