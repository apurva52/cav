import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AccessControlContainerComponent } from "./access-control-container.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("AccessControlContainerComponent", () => {

  let fixture: ComponentFixture<AccessControlContainerComponent>;
  let component: AccessControlContainerComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [AccessControlContainerComponent]
    });

    fixture = TestBed.createComponent(AccessControlContainerComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
