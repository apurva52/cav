import { NO_ERRORS_SCHEMA } from "@angular/core";
import { CapabilityComponent } from "./capability.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("CapabilityComponent", () => {

  let fixture: ComponentFixture<CapabilityComponent>;
  let component: CapabilityComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [CapabilityComponent]
    });

    fixture = TestBed.createComponent(CapabilityComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
