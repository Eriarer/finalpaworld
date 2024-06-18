import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavUserStateComponent } from './nav-user-state.component';

describe('NavUserStateComponent', () => {
  let component: NavUserStateComponent;
  let fixture: ComponentFixture<NavUserStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavUserStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavUserStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
