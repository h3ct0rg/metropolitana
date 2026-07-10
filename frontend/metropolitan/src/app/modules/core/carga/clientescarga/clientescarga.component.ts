import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Cliente } from '../../../../shared/model/cliente';
import { ClientService } from '../../services/clientes.service';
import { SucursalService } from '../../services/sucursal.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-clientescarga',
  templateUrl: './clientescarga.component.html',
  styleUrls: ['./clientescarga.component.css']
})
export class ClientesCargaComponent implements OnInit {
  public form: FormGroup;
  private cliente: Cliente;
  private clientId: number;
  private isEdit: boolean;
  public listSucursal: any[];
  public listCiudad: any[] = [
    { id: 1, nombre: "Cochabamba" },
    { id: 2, nombre: "Santa Cruz" },
    { id: 3, nombre: "La Paz" },
    { id: 4, nombre: "Chuquisaca" },
    { id: 5, nombre: "Orudo" },
    { id: 6, nombre: "Pando" },
    { id: 7, nombre: "Beni" },
    { id: 8, nombre: "Tarija" },
    { id: 9, nombre: "Potosi" },
  ]

  constructor(
    private clienteService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService,
    private sucursalService: SucursalService
  ) {
    this.form = new FormGroup({
      nombreCliente: new FormControl(null, [Validators.required]),
      telefonoCliente: new FormControl(),
      faxCliente: new FormControl(),
      contactoCliente: new FormControl(),
      rucCliente: new FormControl(),
      direccionCliente: new FormControl(),
      casillaCliente: new FormControl(),
      cargoCliente: new FormControl(),
      sucursal: new FormControl(),
      ciudad: new FormControl()
    });

    this.sucursalService.getSucursalList().subscribe(res => {
      this.listSucursal = res;
    });

    this.cliente = {
      id: 0,
      name: "test",
      telefono: "32344",
      fax: "44534534",
      contacto: "test tt",
      ruc: "",
      direccion: "CALLE ACHA 127",
      casilla: "",
      cargo: "GERENTE",
      idSucursal: this.getActualSucursal(),
      idCiudad: 1,
      createBy: 0,
      modify: 0,
      createDate: "0001-01-01T00:00:00",
      modifyDate: "0001-01-01T00:00:00"
    };
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      let clientParam = param;
      this.clientId = clientParam["params"].id;
      if (this.clientId) {
        this.isEdit = true;
        this.loadFarmInformation(this.clientId);
      }
    });
  }

  loadFarmInformation(clienteId) {
    this.clienteService.getClientCarga(clienteId).subscribe((result) => {
      this.clientId = clienteId;
      this.form.get("nombreCliente").setValue(result.name);
      this.form.get("telefonoCliente").setValue(result.telefono);
      this.form.get("faxCliente").setValue(result.fax);
      this.form.get("contactoCliente").setValue(result.contacto);
      this.form.get("rucCliente").setValue(result.ruc);
      this.form.get("direccionCliente").setValue(result.direccion);
      this.form.get("casillaCliente").setValue(result.casilla);
      this.form.get("cargoCliente").setValue(result.cargo);
      this.form.get("sucursal").setValue(this.getActualSucursal().toString());
      this.form.get("ciudad").setValue(result.idCiudad.toString());
    });

  }


  saveClient() {
    this.cliente.name = this.form.get("nombreCliente").value;
    this.cliente.telefono = this.form.get("telefonoCliente").value;
    this.cliente.fax = this.form.get("faxCliente").value;
    this.cliente.contacto = this.form.get("contactoCliente").value;
    this.cliente.ruc = this.form.get("rucCliente").value;
    this.cliente.direccion = this.form.get("direccionCliente").value;
    this.cliente.casilla = this.form.get("casillaCliente").value;
    this.cliente.idCiudad = this.form.get("ciudad").value;
    if (this.cliente.casilla == null) {
      this.cliente.casilla = "";
    }
    this.cliente.cargo = this.form.get("cargoCliente").value;
    if (this.isEdit) {
      this.cliente.id = this.clientId;
      this.clienteService.updateCargaCliente(this.cliente).subscribe((data) => {
        this.router.navigate(['/main/carga/clientesList']);
      });
    }
    else {
      this.clienteService.saveClientCargaItem(this.cliente).subscribe((data) => {
        this.router.navigate(['/main/carga/clientesList']);
      });
    }
  }

  getActualSucursal() {
    const token = this.storage.parse(IStorageKeys.Token);
    return token.sucursal;
  }


}
