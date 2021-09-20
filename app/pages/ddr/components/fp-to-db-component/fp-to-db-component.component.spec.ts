import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FpToDbComponentComponent } from './fp-to-db-component.component';

describe('FpToDbComponentComponent', () => {
  let component: FpToDbComponentComponent;
  let fixture: ComponentFixture<FpToDbComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FpToDbComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FpToDbComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
