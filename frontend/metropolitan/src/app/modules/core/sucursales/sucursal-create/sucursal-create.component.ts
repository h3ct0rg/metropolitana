import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { SucursalService } from '../../services/sucursal.services';
import { Sucursal } from '../../../../shared/model/sucursales';

@Component({
  selector: 'app-sucursal-create',
  templateUrl: './sucursal-create.component.html',
  styleUrls: ['./sucursal-create.component.css']
})
export class SucursalCreateComponent implements OnInit {
  public form: FormGroup;
  public listUsers: any[];
  public sucursal: Sucursal;
  public isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UsuarioService,
    private sucursalService: SucursalService
  ) {
    this.form = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      direccion: new FormControl(null, [Validators.required]),
      telefono: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required]),
      idEncargado: new FormControl(null, [Validators.required])
    })

    this.sucursal = {
      id: 0,
      email: "",
      idEncargado: 0,
      telefonos: "",
      createBy: 0,
      createDate: "0001-01-01T00:00:00",
      direccion: "",
      nombre: "",
      modify: 0,
      modifyDate: "0001-01-01T00:00:00"
    };

    userService.getUsersList().subscribe(result => {
      this.listUsers = result;
    });



  }

  ngOnInit() {
  }

  saveSucursal() {
    this.sucursal.nombre = this.form.get("nombre").value;
    this.sucursal.direccion = this.form.get("direccion").value;
    this.sucursal.telefonos = this.form.get("telefono").value;
    this.sucursal.email = this.form.get("email").value;
    this.sucursal.idEncargado = this.form.get("idEncargado").value;
    if (this.isEdit) {
      this.sucursalService.updateSucursal(this.sucursal).subscribe(result => {
        this.router.navigate(['/main/sucursales']);
      });
    } else {
      this.sucursalService.saveSucursalItem(this.sucursal).subscribe(result => {
        this.router.navigate(['/main/sucursales']);
      });
    }
  }

}
