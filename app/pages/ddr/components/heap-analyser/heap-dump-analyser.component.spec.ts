import { NO_ERRORS_SCHEMA } from "@angular/core";
import { HeapDumpAnalyserComponent } from "./heap-dump-analyser.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("HeapDumpAnalyserComponent", () => {

  let fixture: ComponentFixture<HeapDumpAnalyserComponent>;
  let component: HeapDumpAnalyserComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [HeapDumpAnalyserComponent]
    });

    fixture = TestBed.createComponent(HeapDumpAnalyserComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});
