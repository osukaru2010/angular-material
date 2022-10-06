import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Persona } from 'src/app/interfaces/persona';
import { PersonaService } from 'src/app/services/persona.service';
import { AgregarEditarPersonaComponent } from '../agregar-editar-persona/agregar-editar-persona.component';



@Component({
  selector: 'app-list-personas',
  templateUrl: './list-personas.component.html',
  styleUrls: ['./list-personas.component.css']
})
export class ListPersonasComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nombre', 'apellido', 'correo', 'tipoDocumento', 'documento', 'fechaNacimiento', 'acciones'];
  dataSource: MatTableDataSource<Persona>;
  loading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private _personaService: PersonaService, private _snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource()
  }

  ngOnInit(): void {
    this.obtenerPersonas();
  }

  ngAfterViewInit() {
    this.obtenerPersonas();
  }

  obtenerPersonas(){
    this.loading = true;

    setTimeout(()=>{
      this._personaService.getPersonas().subscribe(data =>{
        this.loading = false;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },2000)
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addEditPersona(id?: number) {
    
    const dialogRef = this.dialog.open(AgregarEditarPersonaComponent, {
      width: '550px',
      disableClose: true,
      data: {id:id}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.obtenerPersonas();
      }
      
    });

  }

  deletePersona(id: number){
    this.loading = true;
   this._personaService.deletePersona(id).subscribe(()=>{
    this.loading = false;
    this.confirmacionDelete();
    this.obtenerPersonas();
    console.log("Persona Eliminada" + id)
   })
  }

  confirmacionDelete(){
    this._snackBar.open("Persona Eliminada con Exito", "Cerrar",{verticalPosition: 'top', direction:'ltr', duration: 2000} )
  }
}

