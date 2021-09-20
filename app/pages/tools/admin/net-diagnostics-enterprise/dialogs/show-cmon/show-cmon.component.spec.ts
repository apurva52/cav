import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCmonComponent } from './show-cmon.component';

describe('ShowCmonComponent', () => {
  let component: ShowCmonComponent;
  let fixture: ComponentFixture<ShowCmonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowCmonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowCmonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
