import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingswithdrawDialogComponent } from './savingswithdraw-dialog.component';

describe('SavingswithdrawDialogComponent', () => {
  let component: SavingswithdrawDialogComponent;
  let fixture: ComponentFixture<SavingswithdrawDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingswithdrawDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SavingswithdrawDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
