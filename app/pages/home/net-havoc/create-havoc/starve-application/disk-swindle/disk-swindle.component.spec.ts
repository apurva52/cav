import { NO_ERRORS_SCHEMA } from "@angular/core";
import { DiskSwindleComponent } from "./disk-swindle.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("DiskSwindleComponent", () => {

  let fixture: ComponentFixture<DiskSwindleComponent>;
  let component: DiskSwindleComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [DiskSwindleComponent]
    });

    fixture = TestBed.createComponent(DiskSwindleComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
