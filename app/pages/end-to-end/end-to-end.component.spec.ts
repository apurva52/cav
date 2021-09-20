import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndComponent } from './end-to-end.component';

describe('EndToEndComponent', () => {
  let component: EndToEndComponent;
  let fixture: ComponentFixture<EndToEndComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
