import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGrupoProductoComponent } from './crear-grupo-producto.component';

describe('CrearGrupoProductoComponent', () => {
  let component: CrearGrupoProductoComponent;
  let fixture: ComponentFixture<CrearGrupoProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearGrupoProductoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearGrupoProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
