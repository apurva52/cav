import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RbuAccessLogsComponent } from './rbu-access-logs.component';

describe('RbuAccessLogsComponent', () => {
  let component: RbuAccessLogsComponent;
  let fixture: ComponentFixture<RbuAccessLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RbuAccessLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RbuAccessLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
