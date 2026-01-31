import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBasketballTeam } from './create-basketball-team';

describe('CreateBasketballTeam', () => {
  let component: CreateBasketballTeam;
  let fixture: ComponentFixture<CreateBasketballTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBasketballTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBasketballTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
