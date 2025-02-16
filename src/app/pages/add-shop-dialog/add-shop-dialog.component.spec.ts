import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShopDialogComponent } from './add-shop-dialog.component';

describe('AddShopDialogComponent', () => {
  let component: AddShopDialogComponent;
  let fixture: ComponentFixture<AddShopDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddShopDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddShopDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
