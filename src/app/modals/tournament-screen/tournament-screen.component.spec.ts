import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentScreenComponent } from './tournament-screen.component';

describe('TournamentScreenComponent', () => {
  let component: TournamentScreenComponent;
  let fixture: ComponentFixture<TournamentScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentScreenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
