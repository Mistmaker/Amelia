import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoUnidadesComponent } from './tipo-unidades.component';

describe('TipoUnidadesComponent', () => {
  let component: TipoUnidadesComponent;
  let fixture: ComponentFixture<TipoUnidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoUnidadesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
