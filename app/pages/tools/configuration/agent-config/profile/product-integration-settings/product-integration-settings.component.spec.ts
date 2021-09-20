import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductIntegrationSettingsComponent } from './product-integration-settings.component';

describe('ProductIntegrationSettingsComponent', () => {
  let component: ProductIntegrationSettingsComponent;
  let fixture: ComponentFixture<ProductIntegrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductIntegrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIntegrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
