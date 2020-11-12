/* SOURCE: https://github.com/angular/angular/issues/2451#issuecomment-333675976
    Proposed to Angular: https://github.com/angular/angular/pull/25472
    TODO: move to https://github.com/ngrx-utils/ngrx-utils#nglet-directive after migrating to NgRX
*/

import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

interface LetContext<T> {
  ngLet: T;
}

@Directive({
  selector: '[ngLet]',
})
export class NgLetDirective<T> {
  // @ts-ignore strictNullChecks
  private _context: LetContext<T> = { ngLet: null };

  constructor(_viewContainer: ViewContainerRef, _templateRef: TemplateRef<LetContext<T>>) {
    _viewContainer.createEmbeddedView(_templateRef, this._context);
  }

  @Input()
  set ngLet(value: T) {
    this._context.ngLet = value;
  }
}
