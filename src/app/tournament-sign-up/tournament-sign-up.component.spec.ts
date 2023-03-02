import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSignUpComponent } from './tournament-sign-up.component';

describe('TournamentSignUpComponent', () => {
  let component: TournamentSignUpComponent;
  let fixture: ComponentFixture<TournamentSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
