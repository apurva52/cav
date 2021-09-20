import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TcpDumpComponent } from './tcp-dump.component';

describe('TcpDumpComponent', () => {
  let component: TcpDumpComponent;
  let fixture: ComponentFixture<TcpDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TcpDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TcpDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
