import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitafuturaComponent } from './citafutura.component';

describe('CitafuturaComponent', () => {
  let component: CitafuturaComponent;
  let fixture: ComponentFixture<CitafuturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitafuturaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CitafuturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
