import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Persona } from 'src/app/interfaces/persona';
import { PersonaService } from 'src/app/services/persona.service';

@Component({
  selector: 'app-agregar-editar-persona',
  templateUrl: './agregar-editar-persona.component.html',
  styleUrls: ['./agregar-editar-persona.component.css']
})
export class AgregarEditarPersonaComponent implements OnInit {

  documentos: string[] = ['CC', 'TI', 'CE', 'PE', 'RC'];
  form: FormGroup;
  maxDate: Date;
  loading: boolean = false
  operacion: string = "Agregar ";
  id: number | undefined;

  constructor(public dialogRef: MatDialogRef<AgregarEditarPersonaComponent>,
    private fb: FormBuilder, private _personaService: PersonaService,
    private _snackBar: MatSnackBar, private dateAdepter: DateAdapter<any>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.maxDate = new Date();
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      tipoDocumento: [null, Validators.required],
      documento: [null, Validators.required],
      fechaNacimiento: [null, Validators.required],

    })

    dateAdepter.setLocale('es');
    this.id = data.id;


  }

  ngOnInit(): void {
    this.esEdit(this.id)

  }

  esEdit(id: number | undefined) {
    if (id !== undefined) {
      this.operacion = "Editar"
      this.getPersona(id)
    }
  }

  getPersona(id: number) {
    this._personaService.getPersona(id).subscribe(data => {
      this.form.setValue({
        nombre: data.nombre,
        apellido: data.apellido,
        correo: data.correo,
        tipoDocumento: data.tipoDocumento,
        documento: data.documento,
        fechaNacimiento: new Date(data.fechaNacimiento)
      })
    })
  }

  cancelar() {
    this.dialogRef.close(false);
  }

  addEditPersona() {
    // (this.form.invalid) {
      //return
   // }
    const persona: Persona = {
      nombre: this.form.value.nombre,
      apellido: this.form.value.apellido,
      correo: this.form.value.correo,
      tipoDocumento: this.form.value.tipoDocumento,
      documento: this.form.value.documento,
      fechaNacimiento: this.form.value.fechaNacimiento.toISOString().slice(0, 10)
    }
    this.loading = true;

    if (this.id == undefined) {
      //es agregar
      this._personaService.AddPersona(persona).subscribe(() => {
        this.loading = false;
        this.dialogRef.close(true);
        this.openSnackBar()
      })
    } else {
      //es editar
      this._personaService.updatePersona(this.id, persona).subscribe(() => {
        this.loading = false;
        this.dialogRef.close(true);
        this.openSnackBar()
      })
    }



  }

  openSnackBar() {
    if (this.id == undefined) {
      this._snackBar.open("Persona Agregada con Exito", "Cerrar", { duration: 2000 });
    } else {
      this._snackBar.open("Persona Editada con Exito", "Cerrar", { duration: 2000 });
    }

  }

}
