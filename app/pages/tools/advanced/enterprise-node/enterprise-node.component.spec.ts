import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseNodeComponent } from './enterprise-node.component';

describe('EnterpriseNodeComponent', () => {
  let component: EnterpriseNodeComponent;
  let fixture: ComponentFixture<EnterpriseNodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseNodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
