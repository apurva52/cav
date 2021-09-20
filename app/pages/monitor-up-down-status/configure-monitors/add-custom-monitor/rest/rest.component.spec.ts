import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RestComponent } from "./rest.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RestComponent", () => {

  let fixture: ComponentFixture<RestComponent>;
  let component: RestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RestComponent]
    });

    fixture = TestBed.createComponent(RestComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
