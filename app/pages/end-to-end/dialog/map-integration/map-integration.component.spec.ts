import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapIntegrationComponent } from './map-integration.component';

describe('MapIntegrationComponent', () => {
  let component: MapIntegrationComponent;
  let fixture: ComponentFixture<MapIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
