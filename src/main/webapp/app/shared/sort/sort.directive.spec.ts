import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { SortDirective } from './sort.directive';

@Component({
  template: `
    <table>
      <thead>
        <tr jhiSort [(predicate)]="predicate" [(ascending)]="ascending" [callback]="transition.bind(this)"></tr>
      </thead>
    </table>
  `,
})
class TestSortDirectiveComponent {
  predicate?: string;
  ascending?: boolean;
  transition = jest.fn();
}

describe('Directive: SortDirective', () => {
  let component: TestSortDirectiveComponent;
  let fixture: ComponentFixture<TestSortDirectiveComponent>;
  let tableRow: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestSortDirectiveComponent, SortDirective],
    });
    fixture = TestBed.createComponent(TestSortDirectiveComponent);
    component = fixture.componentInstance;
    tableRow = fixture.debugElement.query(By.directive(SortDirective));
  });

  it('should update predicate, order and invoke callback function', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');

    // THEN
    expect(component.predicate).toEqual('ID');
    expect(component.ascending).toEqual(true);
    expect(component.transition).toHaveBeenCalled();
    expect(component.transition).toHaveBeenCalledTimes(1);
  });

  it('should change sort order to descending when same field is sorted again', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');
    // sort again
    sortDirective.sort('ID');

    // THEN
    expect(component.predicate).toEqual('ID');
    expect(component.ascending).toEqual(false);
    expect(component.transition).toHaveBeenCalled();
    expect(component.transition).toHaveBeenCalledTimes(2);
  });

  it('should change sort order to ascending when different field is sorted', () => {
    // GIVEN
    const sortDirective = tableRow.injector.get(SortDirective);

    // WHEN
    fixture.detectChanges();
    sortDirective.sort('ID');
    // sort again
    sortDirective.sort('NAME');

    // THEN
    expect(component.predicate).toEqual('NAME');
    expect(component.ascending).toEqual(true);
    expect(component.transition).toHaveBeenCalled();
    expect(component.transition).toHaveBeenCalledTimes(2);
  });
});
