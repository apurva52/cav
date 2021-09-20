import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationPointComponent } from './integration-point.component';

describe('IntegrationPointComponent', () => {
  let component: IntegrationPointComponent;
  let fixture: ComponentFixture<IntegrationPointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationPointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationPointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
