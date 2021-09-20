import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeNsmComponent } from './home-nsm.component';

describe('HomeNsmComponent', () => {
  let component: HomeNsmComponent;
  let fixture: ComponentFixture<HomeNsmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeNsmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeNsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
