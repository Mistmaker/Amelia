import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoUnidadComponent } from './crear-tipo-unidad.component';

describe('CrearTipoUnidadComponent', () => {
  let component: CrearTipoUnidadComponent;
  let fixture: ComponentFixture<CrearTipoUnidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTipoUnidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTipoUnidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
