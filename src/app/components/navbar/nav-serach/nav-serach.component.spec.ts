import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavSerachComponent } from './nav-serach.component';

describe('NavSerachComponent', () => {
  let component: NavSerachComponent;
  let fixture: ComponentFixture<NavSerachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavSerachComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavSerachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
