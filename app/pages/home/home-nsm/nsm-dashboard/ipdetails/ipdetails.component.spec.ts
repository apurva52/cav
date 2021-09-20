import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdetailsComponent } from './ipdetails.component';

describe('IpdetailsComponent', () => {
  let component: IpdetailsComponent;
  let fixture: ComponentFixture<IpdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
