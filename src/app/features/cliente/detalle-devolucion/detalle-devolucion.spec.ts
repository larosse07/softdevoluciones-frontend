import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleDevolucion } from './detalle-devolucion';

describe('DetalleDevolucion', () => {
  let component: DetalleDevolucion;
  let fixture: ComponentFixture<DetalleDevolucion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleDevolucion],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalleDevolucion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
