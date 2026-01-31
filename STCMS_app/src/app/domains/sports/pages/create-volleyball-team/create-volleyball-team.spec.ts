import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVolleyballTeam } from './create-volleyball-team';

describe('CreateVolleyballTeam', () => {
  let component: CreateVolleyballTeam;
  let fixture: ComponentFixture<CreateVolleyballTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateVolleyballTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateVolleyballTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
