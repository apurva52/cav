import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpGatewayComponent } from './ip-gateway.component';

describe('IpGatewayComponent', () => {
  let component: IpGatewayComponent;
  let fixture: ComponentFixture<IpGatewayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpGatewayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpGatewayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
