import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GdfHomeComponent } from './gdf-home.component';

describe('GdfHomeComponent', () => {
  let component: GdfHomeComponent;
  let fixture: ComponentFixture<GdfHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdfHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdfHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
