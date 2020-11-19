import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentoDatosComponent } from './segmento-datos.component';

describe('SegmentoDatosComponent', () => {
  let component: SegmentoDatosComponent;
  let fixture: ComponentFixture<SegmentoDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SegmentoDatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentoDatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
