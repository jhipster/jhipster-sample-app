import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ChangeDetectionStrategy, Component, DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SortState, sortStateSignal } from './sort-state';
import { SortDirective } from './sort.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SortDirective],
  template: `
    <table>
      <thead>
        <tr jhiSort [(sortState)]="sortState" (sortChange)="transition($event)"></tr>
      </thead>
    </table>
  `,
})
class TestSortDirective {
  sortState = sortStateSignal({ predicate: 'ID' });
  transition = vitest.fn().mockImplementation((sortState: SortState) => {
    this.sortState.set(sortState);
  });
}

describe('Directive: SortDirective', () => {
  let component: TestSortDirective;
  let fixture: ComponentFixture<TestSortDirective>;
  let tableRow: DebugElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSortDirective);
    component = fixture.componentInstance;
    tableRow = fixture.debugElement.query(By.directive(SortDirective));
  });

  it('should invoke sortChange function', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective as Type<SortDirective>);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');

    // THEN
    expect(component.transition).toHaveBeenCalledTimes(1);
    expect(component.transition).toHaveBeenCalledWith({ predicate: 'ID', order: 'asc' });
  });

  it('should change sort order to descending, neutral when same field is sorted again', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective as Type<SortDirective>);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');
    // sort again
    sortDirective.sort('ID');
    // sort again
    sortDirective.sort('ID');

    // THEN
    expect(component.transition).toHaveBeenCalledTimes(3);
    expect(component.transition).toHaveBeenNthCalledWith(1, { predicate: 'ID', order: 'asc' });
    expect(component.transition).toHaveBeenNthCalledWith(2, { predicate: 'ID', order: 'desc' });
    expect(component.transition).toHaveBeenNthCalledWith(3, { predicate: 'ID', order: 'asc' });
  });

  it('should change sort order to ascending when different field is sorted', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective as Type<SortDirective>);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');
    // sort again
    sortDirective.sort('NAME');

    // THEN
    expect(component.transition).toHaveBeenCalledTimes(2);
    expect(component.transition).toHaveBeenNthCalledWith(1, { predicate: 'ID', order: 'asc' });
    expect(component.transition).toHaveBeenNthCalledWith(2, { predicate: 'NAME', order: 'asc' });
  });
});
