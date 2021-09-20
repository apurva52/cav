import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpStatComponent } from './ip-stat.component';

describe('IpStatComponent', () => {
  let component: IpStatComponent;
  let fixture: ComponentFixture<IpStatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpStatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpStatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
