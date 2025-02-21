import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddExpenseItemDialogComponent } from './add-expense-item-dialog.component';

describe('AddExpenseItemDialogComponent', () => {
  let component: AddExpenseItemDialogComponent;
  let fixture: ComponentFixture<AddExpenseItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddExpenseItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddExpenseItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
