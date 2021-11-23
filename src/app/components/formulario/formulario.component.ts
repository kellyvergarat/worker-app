import { Component, OnInit } from '@angular/core';
//imports necesarios para el forms
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
//imports de los modulos creados config para conectar backend y service
import { ConfigService } from 'src/app/services/config.service';
import { WorkerService } from 'src/app/services/worker.service';
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  public form: FormGroup
  //variables de mi modelo - se definen abstract control por angular, para poder utilizar sus metodos
  public name: AbstractControl
  public document: AbstractControl
  public phone: AbstractControl
  public email: AbstractControl
  public salary: AbstractControl
  public female: AbstractControl
  public dateOfBirth: AbstractControl
  // se utiliza para validación
  public sub = false
  //array de todos los trabajadores ingresados
  public workers: any[] = []
  // se utiliza para la función editar
  public selectedId = ""

  constructor(
    public formBuilder: FormBuilder,
    public config: ConfigService,
    //son los metodos del backend - servicio que une el backend con el frontend
    private workerService: WorkerService
  ) { //validador de la campo de nombre
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      document: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      salary: ['', Validators.required],
      female: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
    })
    this.name = this.form.controls['name']
    this.document = this.form.controls['document']
    this.phone = this.form.controls['phone']
    this.email = this.form.controls['email']
    this.salary = this.form.controls['salary']
    this.female = this.form.controls['female']
    this.dateOfBirth = this.form.controls['dateOfBirth']
  }

  ngOnInit(): void {
    this.list()
  }

  get f() {
    return this.form.controls
  }
 //validador de la campo de nombre vacio
  validacion() {
    console.log(this.form.value)
    this.sub = true
    if (this.form.invalid)
      return
    this.add()
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  getConfigFc() {
    return this.config
  }

  add() {
    //console.log(this.selectedId)
    if (this.selectedId) {
      //console.log(1)
      this.commitEdit()
    } else {
      //console.log(this.form.controls['name'].value)
      //console.log(2)
      //this.workers.push({ id: this.create_UUID() , name : this.form.controls['name'].value, status: false})
      //console.log(this.workers)
      this.workerService.create(this.form.value).subscribe({
        next: (res: any) => {
          if (res.status) {
            console.log('Trabajador registrado')
          }
        },
        complete: () => { this.list() }, // completeHandler
        error: () => { console.log('Error creating worker') }    // errorHandler
      })
    }
    this.reset()
    this.sub = false
  }

  reset() {
    this.form.reset()
  }

  edit(item: any) {
    console.log(item)
    this.form.get('name')?.setValue(item.name)
    this.selectedId = item._id
  }

  commitEdit() {
    for (let index = 0; index < this.workers.length; index++) {
      if (this.workers[index]._id == this.selectedId) {
       // this.workers[index].name = this.form.get('name')?.value

        this.workerService.update({
          _id: this.selectedId,
          name: this.form.get('name')?.value,
          document: this.form.get('document')?.value,
          phone: this.form.get('phone')?.value,
          email: this.form.get('email')?.value,
          salary: this.form.get('salary')?.value,
          female: this.form.get('female')?.value,
          dateOfBirth: this.form.get('dateOfBirth')?.value
        }).subscribe({
          next: (res: any) => {
            if (res.status) {
            }
          },
          complete: () => { this.list()
          }, // completeHandler
          error: () => { console.log('Error updating worker') }    // errorHandler
        })
        //console.log(this.form.get('name')?.value)
      }
    }
    this.selectedId = ""
    //console.log(this.workers)
  }

  delete(_id: string) {
    for (let index = 0; index < this.workers.length; index++) {
      if (this.workers[index]._id == _id) {
        this.workerService.delete(_id).subscribe({
          next: (res: any) => {
            if (res.status) {
              this.workers.splice(index, 1)
              console.log('Trabajador eliminado')
            }
          },
          complete: () => { this.list() }, // completeHandler
          error: () => { console.log('Error removing worker') }    // errorHandler
        })
      }
    }
  }

  disEnable(item: any) {
    for (let index = 0; index < this.workers.length; index++) {
      if (this.workers[index]._id == item._id) {
        this.workerService.active({
          _id: item._id,
          status: !item.status
        }).subscribe({
          next: (res: any) => {
            if (res.status) {
              console.log('Usuario actualizado')
            }
          },
          complete: () => {
            this.workers[index].status = !this.workers[index].status
          }, // completeHandler
          error: () => { console.log('Error removing worker') }    // errorHandler
        })
      }
    }
  }

  list() {
    this.workerService.list().subscribe({
      next: (res: any) => {
        if (res.length>0) {
          this.workers = res
        }
      },
      complete: () => { console.log('Trabajadores listados') }, // completeHandler
      error: () => { console.log('Error to the list workers') }    // errorHandler
    })
  }
  searchget(event:any) {
      this.workerService.search({
        name: event.target.value
      }).subscribe({
        next: (res: any) => {
          console.log(res)
          console.log(res.length)
          if (res.length>0) {
            this.workers = res
          }
        },
        complete: () => { console.log('Trabajadores listados') }, // completeHandler
        error: () => { console.log('Error to the list workers') }    // errorHandler
      })
  }
}
