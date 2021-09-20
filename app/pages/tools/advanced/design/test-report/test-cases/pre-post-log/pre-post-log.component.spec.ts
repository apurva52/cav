import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePostLogComponent } from './pre-post-log.component';

describe('PrePostLogComponent', () => {
  let component: PrePostLogComponent;
  let fixture: ComponentFixture<PrePostLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrePostLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePostLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
