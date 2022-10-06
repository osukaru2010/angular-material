import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Persona } from '../interfaces/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private myAppURL: string;
  private myApiUrl: string;
  constructor(private http: HttpClient) {
  this.myAppURL = environment.endpoint;
  this.myApiUrl = 'api/personas'


   }

   getPersonas(): Observable<Persona[]> {
    //return this.http.get<Persona[]>(` ${this.myAppURL}${this.myApiUrl}` )
    return this.http.get<Persona[]>(this.myAppURL+this.myApiUrl)
   }

   deletePersona(id: number): Observable<void> {
     return this.http.delete<void>(this.myAppURL+this.myApiUrl+"/"+id)
   }

   AddPersona(persona: Persona): Observable<void>{
    return this.http.post<void>(this.myAppURL+this.myApiUrl, persona);
   }


   getPersona(id:number): Observable<Persona>{
    return this.http.get<Persona>(this.myAppURL+this.myApiUrl+"/"+id);
   }

   updatePersona(id: number, persona:Persona): Observable<void>{
    return this.http.put<void>(this.myAppURL+this.myApiUrl+"/"+id, persona);
   }
}
