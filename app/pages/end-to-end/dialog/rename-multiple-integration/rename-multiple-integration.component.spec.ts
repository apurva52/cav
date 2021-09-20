import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameMultipleIntegrationComponent } from './rename-multiple-integration.component';

describe('RenameMultipleIntegrationComponent', () => {
  let component: RenameMultipleIntegrationComponent;
  let fixture: ComponentFixture<RenameMultipleIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenameMultipleIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenameMultipleIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
