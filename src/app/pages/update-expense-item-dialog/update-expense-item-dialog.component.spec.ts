import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpenseItemDialogComponent } from './update-expense-item-dialog.component';

describe('UpdateExpenseItemDialogComponent', () => {
  let component: UpdateExpenseItemDialogComponent;
  let fixture: ComponentFixture<UpdateExpenseItemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateExpenseItemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateExpenseItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
