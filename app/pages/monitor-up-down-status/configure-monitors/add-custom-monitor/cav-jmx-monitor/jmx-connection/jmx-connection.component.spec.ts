import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JmxConnectionComponent } from './jmx-connection.component';

describe('CavJmxConnectionComponent', () => {
  let component: JmxConnectionComponent;
  let fixture: ComponentFixture<JmxConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JmxConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JmxConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
