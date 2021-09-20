import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpManagementComponent } from './ip-management.component';

describe('IpManagementComponent', () => {
  let component: IpManagementComponent;
  let fixture: ComponentFixture<IpManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
