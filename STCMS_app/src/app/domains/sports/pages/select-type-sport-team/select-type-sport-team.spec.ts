import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTypeSportTeam } from './select-type-sport-team';

describe('SelectTypeSportTeam', () => {
  let component: SelectTypeSportTeam;
  let fixture: ComponentFixture<SelectTypeSportTeam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectTypeSportTeam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectTypeSportTeam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
