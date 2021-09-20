import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StartNcmonComponent } from './start-ncmon.component';

describe('StartNcmonComponent', () => {
  let component: StartNcmonComponent;
  let fixture: ComponentFixture<StartNcmonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StartNcmonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StartNcmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
