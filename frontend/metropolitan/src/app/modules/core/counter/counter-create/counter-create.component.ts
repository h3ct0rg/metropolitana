import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { CounterService } from '../../services/counter.services';
import { Counter } from '../../../../shared/model/counter';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../services/clientes.service';
import { Proveedor } from '../../../../shared/model/proveedor';
import { ProveedorService } from '../../services/proveedor.services';

import { TransferCanMove, TransferItem } from 'ng-zorro-antd/transfer';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OperadorService } from '../../services/operador.services';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { StorageService } from '../../../../shared/services/local-data/storage.service';

@Component({
  selector: 'Counter-create',
  templateUrl: './Counter-create.component.html',
  styleUrls: ['./Counter-create.component.css']
})
export class CounterCreateComponent implements OnInit {

  public form: FormGroup;
  private Counter: Counter;
  public listProveedor: Proveedor[];
  public list: TransferItem[] = [];
  private CounterId: number;
  private isEdit: boolean;
  public listaAgencia: [] = [];
  public weMove: boolean = true;

  constructor(
    private CounterService: CounterService,
    private route: ActivatedRoute,
    private router: Router,
    private clientes: ClientService,
    private operadorService: OperadorService,
    private storageService: StorageService
  ) {
    this.form = new FormGroup({
      nombreCounter: new FormControl(null, [Validators.required]),
      direccionCounter: new FormControl(),
      codigoCounter: new FormControl(),
      porcentajeNormal: new FormControl(null, [Validators.required]),
      porcentajeLowCost: new FormControl(null, [Validators.required]),
      porcentajeAMP: new FormControl(null, [Validators.required]),
      porcentajeEspecial: new FormControl(null, [Validators.required]),
      agencias: new FormControl(null, [Validators.required])
    });
    this.Counter = {
      id: 0,
      name: "test",
      telefono: "32344",
      direccion: "44534534",
      porcentajeNormal: 0,
      porcentajeLow: 0,
      porcentajeCorp: 0,
      porcentajeEspecial: 0,
      idSucursal: this.getActualSucursal(),
      createBy: 0,
      modify: 0,
      createDate: "0001-01-01T00:00:00",
      modifyDate: "0001-01-01T00:00:00"
    };

    this.clientes.getClientList().subscribe(data => {
      this.listaAgencia = data;
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(param => {
      let CounterParam = param;
      this.CounterId = CounterParam["params"].id;
      if (this.CounterId) {
        this.isEdit = true;
        this.loadFarmInformation(this.CounterId);
      }
      else {
        this.operadorService.getOperadorList().subscribe(resultPro => {
          let ll: TransferItem[] = [];
          this.listProveedor = resultPro;
          this.listProveedor.forEach(res => {
            ll.push(
              {
                key: res.id.toString(),
                title: res.name
              });
          });
          this.list = ll;
        });
      }
    });



  }

  loadFarmInformation(clienteId) {
    this.CounterService.getCounter(clienteId).subscribe((result) => {
      this.CounterId = clienteId;
      this.form.get("nombreCounter").setValue(result.name);
      this.form.get("codigoCounter").setValue(result.nombreCod);
      this.form.get("direccionCounter").setValue(result.direccion);

      this.form.get("porcentajeNormal").setValue(result.porcentajeNormal);
      this.form.get("porcentajeLowCost").setValue(result.porcentajeLow);
      this.form.get("porcentajeAMP").setValue(result.porcentajeCorp);
      this.form.get("porcentajeEspecial").setValue(result.porcentajeEspecial);
      this.form.get("agencias").setValue(result.idAgencia.toString());
      let listResult = result.idsProveedores.split(',');
      this.operadorService.getOperadorList().subscribe(resultPro => {
        let ll: TransferItem[] = [];
        this.listProveedor = resultPro;
        this.listProveedor.forEach(res => {
          let exist = listResult.filter(fr => fr == res.id.toString());
          if (exist.length > 0) {
            ll.push(
              {
                key: res.id.toString(),
                title: res.name,
                direction: 'right'
              });
          }
          else {
            ll.push(
              {
                key: res.id.toString(),
                title: res.name
              });
          }
        });
        this.list = ll;
      });
    });

  }

  saveCounter() {
    this.Counter.name = this.form.get("nombreCounter").value;
    this.Counter.nombreCod = this.form.get("codigoCounter").value;
    this.Counter.direccion = this.form.get("direccionCounter").value;
    this.Counter.porcentajeNormal = this.form.get("porcentajeNormal").value;
    this.Counter.porcentajeLow = this.form.get("porcentajeLowCost").value;
    this.Counter.porcentajeCorp = this.form.get("porcentajeAMP").value;
    this.Counter.porcentajeEspecial = this.form.get("porcentajeEspecial").value;
    this.Counter.idAgencia = this.form.get("agencias").value;
    let listProveedores = this.getSelectedProveedores();
    this.Counter.idsProveedores = listProveedores;
    if (this.isEdit) {
      this.Counter.id = this.CounterId;
      this.CounterService.updateCounter(this.Counter).subscribe((data) => {
        this.router.navigate(['/main/counter']);
      });
    }
    else {
      this.CounterService.savetCounterItem(this.Counter).subscribe((data) => {
        this.router.navigate(['/main/counter']);
      });
    }
  }
  getSelectedProveedores() {
    let listResult = "";
    this.list.forEach(dato => {
      if (dato.direction == "right") {
        listResult += dato['key'] + ",";
      }
    })
    return listResult;
  }

  canMove(arg: TransferCanMove): Observable<TransferItem[]> {
    if (arg.direction === 'right' && arg.list.length > 0) {
      arg.list.splice(0, 1);
    }
    // or
    // if (arg.direction === 'right' && arg.list.length > 0) delete arg.list[0];
    return of(arg.list).pipe(delay(1000));
  }

  select(ret: {}): void {
  }

  change($event) {
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

}
