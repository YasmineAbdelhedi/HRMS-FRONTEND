import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaverequestsComponent } from './leaverequests.component';

describe('LeaverequestsComponent', () => {
  let component: LeaverequestsComponent;
  let fixture: ComponentFixture<LeaverequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaverequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaverequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
