import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDataComponent } from './history-data.component';

describe('HistoryDataComponent', () => {
  let component: HistoryDataComponent;
  let fixture: ComponentFixture<HistoryDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoryDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
