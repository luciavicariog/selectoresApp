import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisSmall } from '../../interfaces/paises.interface';
import { PaisesService } from '../../services/paises.service';
import { switchMap, tap } from "rxjs/operators";

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styleUrls: []
})
export class SelectorPageComponent implements OnInit {

  miFormulario: FormGroup = this.fb.group({
    region:['', [Validators.required]],
    pais: ['',Validators.required],
    frontera: ['',Validators.required],
  })

  regiones: string[] = [];
  paises: PaisSmall[] = [];
  // fronteras: string[] = [];
  fronteras: PaisSmall[][] = [];

  cargando:boolean = false;

  constructor(private fb : FormBuilder,
              private paisesService: PaisesService) { }

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //Cuando cambie la region
    this.miFormulario.get('region')?.valueChanges
    .pipe(
      tap(( _ ) => {
        this.paises = [];
        this.miFormulario.get('pais')?.reset('');
        this.cargando = true;
      }),
      switchMap(region =>  this.paisesService.getPaisesPorRegion(region))
    )
    .subscribe(paises => {
      this.cargando = false;
      this.paises = paises;
    })

    //Cuando cambie el pais
    this.miFormulario.get('pais')?.valueChanges
    .pipe(
      tap( () => {
        this.fronteras = [];
        this.miFormulario.get('frontera')?.reset('');
        this.cargando = true;
      }),
      switchMap(paisCode =>  this.paisesService.getPaisPorCodigo(paisCode)),
      switchMap(pais => this.paisesService.getPaisesPorCodigos(pais[0]?.borders))
    )
    .subscribe(paises => {
      // if (pais.length > 0 && pais[0].borders) {
      //   this.fronteras = pais[0].borders
      // }
      console.log(paises);
      this.fronteras = paises;
      this.cargando = false;
    })
  }

  guardar(){
    console.log(this.miFormulario.value);
  }

}
