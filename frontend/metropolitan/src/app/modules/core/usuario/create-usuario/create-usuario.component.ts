import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { ProveedorService } from '../../services/proveedor.services';
import { User } from '../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { SucursalService } from '../../services/sucursal.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'usuario-create',
  templateUrl: './create-usuario.component.html',
  styleUrls: ['./create-usuario.component.css']
})
export class UsuarioCreateComponent implements OnInit {

  public form: FormGroup;
  public usuario: User;
  private userId: number;
  public isEdit: boolean;
  public idroles: any[] = [];
  public listSucursales: any[];
  public isAdmin: boolean = false;

  constructor(private userService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private sucursalesService: SucursalService,
    private storageService: StorageService
  ) {

    this.setUserName();

    this.form = new FormGroup({
      nombreUsuario: new FormControl(),
      ciUser: new FormControl(),
      emailUser: new FormControl(),
      usuarioUser: new FormControl(),
      passwordUser: new FormControl(),
      selectRol: new FormControl(),
      sucursal: new FormControl()
    });
    this.usuario = {
      id: 0,
      nombre: "test",
      ci: "32344",
      email: "44534534",
      usuarioCompany: "admin",
      password: "admin",
      idRole: [1],
      createdBy: 0,
      createdDate: "0001-01-01T00:00:00",
      idSucursal: 1,
      modifieDate: "0001-01-01T00:00:00",
      modifyBy: 1
    };
    this.idroles = [{ id: 1, name: "Admin" }, { id: 2, name: "Travelace" }, { id: 3, name: "Paquetes" }, { id: 4, name: "Carga" }];

    this.sucursalesService.getSucursalList().subscribe(result => {
      this.listSucursales = result;
    });


  }

  ngOnInit() {
    this.usuario = {
      id: 0,
      nombre: "test",
      ci: "32344",
      email: "44534534",
      usuarioCompany: "admin",
      password: "admin",
      idRole: [1],
      idSucursal: 0,
      createdBy: 0,
      modifyBy: 0,
      createdDate: "2020/02/28",
      modifieDate: "2020/02/28"
    };

    this.route.paramMap.subscribe(param => {
      let proveedorParam = param;
      this.userId = proveedorParam["params"].id;
      this.usuario.id = this.userId;
      if (this.usuario.id != undefined) {
        if (this.usuario.id != 0) {
          this.isEdit = true;
          this.loadFarmInformation(this.usuario);
        }
      }
    });

  }

  loadFarmInformation(clienteId) {
    this.userService.getUser(clienteId.id).subscribe((result) => {
      this.usuario = clienteId;
      this.form.get("nombreUsuario").setValue(result.nombre);
      this.form.get("ciUser").setValue(result.ci);
      this.form.get("usuarioUser").setValue(result.usuarioCompany);
      this.form.get("emailUser").setValue(result.email);
      this.form.get("passwordUser").setValue(result.password);
      this.form.get("selectRol").setValue(result.idRole);
      this.form.get("sucursal").setValue(result.idSucursal);
    });

  }

  saveProveedor() {
    this.usuario.nombre = this.form.get("nombreUsuario").value;
    this.usuario.ci = this.form.get("ciUser").value;
    this.usuario.usuarioCompany = this.form.get("usuarioUser").value;
    this.usuario.email = this.form.get("emailUser").value;
    this.usuario.password = this.form.get("passwordUser").value;
    this.usuario.idRole = this.form.get("selectRol").value;
    this.usuario.idSucursal = this.form.get("sucursal").value;
    if (this.isEdit) {
      this.usuario.id = this.userId;
      this.userService.updateUser(this.usuario).subscribe((data) => {
        this.router.navigate(['/main/usuarios']);
      });
    }
    else {
      this.usuario.id = 0;
      this.userService.saveUserItem(this.usuario).subscribe((data) => {
        this.router.navigate(['/main/usuarios']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/main/usuarios']);
  }

  setUserName = () => {
    const token = this.storageService.parse(IStorageKeys.Token);
    this.userService.getUser(token['userId']).subscribe(item => {
      let listRole = item.idRole;
      listRole.forEach(l => {
        if (l == 1) {
          this.isAdmin = true;
        }
      });
    });

  }
}
