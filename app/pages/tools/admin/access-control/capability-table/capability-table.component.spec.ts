import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CapabilityTableComponent } from "./capability-table.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CapabilityTableComponent", () => {

  let fixture: ComponentFixture<CapabilityTableComponent>;
  let component: CapabilityTableComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CapabilityTableComponent]
    });

    fixture = TestBed.createComponent(CapabilityTableComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
