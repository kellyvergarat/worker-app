import { Injectable } from '@angular/core';
//se importan para volver a manipularlos en este file
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  // llama al backend para manipularlo dentro de este servicio
  readonly URL_API = this.config.getConfig().backend.url
  //por ser inyectables se introducen en el constructor
  constructor(private config: ConfigService,
              private http: HttpClient) { }
  // workers hace referencia a la url que se usa para acceder al metodo del backend - ejemplo en postman
  create(data:any){
    return this.http.post(this.URL_API+'/workers', data)
  }

  update(data:any){
    return this.http.put(this.URL_API+'/workers', data)
  }

  delete(id:string){
    return this.http.delete(this.URL_API+'/workers/' + id)
  }

  list(){
    return this.http.get(this.URL_API+'/workers/')
  }

  active(data:any){
    return this.http.put(this.URL_API+'/workers/active', data)
  }

  search(data:any){
    return this.http.post(this.URL_API+'/workers/search', data)
  }

  searchGet(data:any){
    return this.http.get(this.URL_API+'/user/searchget', data)
  }

}
