import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExpenseDialogComponent } from './update-expense-dialog.component';

describe('UpdateExpenseDialogComponent', () => {
  let component: UpdateExpenseDialogComponent;
  let fixture: ComponentFixture<UpdateExpenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateExpenseDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
