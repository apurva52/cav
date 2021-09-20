import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigMemoryProflingSessionsComponent } from './config-memory-profiling-sessions.component';

describe('DdrMemoryStatusComponent', () => {
  let component: ConfigMemoryProflingSessionsComponent;
  let fixture: ComponentFixture<ConfigMemoryProflingSessionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigMemoryProflingSessionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigMemoryProflingSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
