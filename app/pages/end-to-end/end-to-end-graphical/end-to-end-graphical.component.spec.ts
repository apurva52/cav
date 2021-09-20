import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndToEndGraphicalComponent } from './end-to-end-graphical.component';

describe('EndToEndGraphicalComponent', () => {
  let component: EndToEndGraphicalComponent;
  let fixture: ComponentFixture<EndToEndGraphicalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndToEndGraphicalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndToEndGraphicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
