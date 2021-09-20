import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AccessControlComponent } from "./access-control.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("AccessControlComponent", () => {

  let fixture: ComponentFixture<AccessControlComponent>;
  let component: AccessControlComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [AccessControlComponent]
    });

    fixture = TestBed.createComponent(AccessControlComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
