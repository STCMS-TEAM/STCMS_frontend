import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFootballTeam } from './create-football-team';

describe('CreateFootballTeam', () => {
  let component: CreateFootballTeam;
  let fixture: ComponentFixture<CreateFootballTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFootballTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFootballTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
