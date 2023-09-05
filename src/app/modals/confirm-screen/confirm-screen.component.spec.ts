import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmScreenComponent } from './confirm-screen.component';

describe('ConfirmScreenComponent', () => {
  let component: ConfirmScreenComponent;
  let fixture: ComponentFixture<ConfirmScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
