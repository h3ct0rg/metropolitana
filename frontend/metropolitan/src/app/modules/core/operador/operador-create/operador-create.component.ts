import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validator, Validators, ReactiveFormsModule } from "@angular/forms";
import { Operador } from '../../../../shared/model/operador';
import { ActivatedRoute, Router } from '@angular/router';
import { OperadorService } from '../../services/operador.services';
import { CounterService } from '../../services/counter.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { AuthenticationService } from '../../../security/services/authentication.services';

@Component({
  selector: 'operador-create',
  templateUrl: './operador-create.component.html',
  styleUrls: ['./operador-create.component.css']
})
export class OperadorCreateComponent implements OnInit {

  public form: FormGroup;
  private operador: Operador;
  private operadorId: number;
  private isEdit: boolean;

  public porcentajeValido: boolean;
  public maxPorcentaje: number;
  public totalActualPorcentaje: number;
  public startingValue: number;

  counters: [] = [];
  constructor(
    private operadorService: OperadorService,
    private route: ActivatedRoute,
    private counterService: CounterService,
    private router: Router,
    private storageService: StorageService,
    private authenticationService: AuthenticationService
  ) {

    this.counterService.getCounterList().subscribe(data => {
      this.counters = data;
    });

    this.form = new FormGroup({
      nombreOperador: new FormControl(null, [Validators.required]),
      direccionOperador: new FormControl(),
      telefonoOperador: new FormControl(),
      porcentajeArgentina: new FormControl(null, [Validators.required]),
      porcentajeAgencia: new FormControl(null, [Validators.required]),
      porcentajeCounter: new FormControl(),
      porcentajeMetropolitan: new FormControl(null, [Validators.required]),
      counter: new FormControl(),

    });

    this.startingValue = this.form.get("counter").value;

    this.form.get("counter").valueChanges.subscribe(data => {
      this.calculateData();
    });

    this.form.get("porcentajeMetropolitan").valueChanges.subscribe(data => {
      this.calculateData();
    });
    this.form.get("porcentajeArgentina").valueChanges.subscribe(data => {
      this.calculateData();
    });
    this.form.get("porcentajeAgencia").valueChanges.subscribe(data => {
      this.calculateData();
    });

    this.operador = {
      id: 0,
      name: "test",
      telefono: "32344",
      direccion: "44534534",
      createBy: 0,
      tipoOperador: 0,
      modify: 0,
      createDate: "0001-01-01T00:00:00",
      modifyDate: "0001-01-01T00:00:00",
      porcentajeAgencia: 0,
      porcentajeArgentina: 0,
      counterId: 0,
      porcentajeMetropolitana: 0,
      idSucursal: this.getActualSucursal()      
    };
  }

  ngOnInit() {




    this.route.paramMap.subscribe(param => {
      let operadorParam = param;
      this.operadorId = operadorParam["params"].id;
      if (this.operadorId) {
        this.isEdit = true;
        this.loadFarmInformation(this.operadorId);
      }
    });

  }

  loadFarmInformation(clienteId) {
    this.operadorService.getOperador(clienteId).subscribe((result) => {
      this.operadorId = clienteId;
      this.form.get("nombreOperador").setValue(result.name);
      this.form.get("telefonoOperador").setValue(result.telefono);
      this.form.get("direccionOperador").setValue(result.direccion);
      this.form.get("porcentajeArgentina").setValue(result.porcentajeArgentina);
      this.form.get("porcentajeAgencia").setValue(result.porcentajeAgencia);
      this.form.get("counter").setValue(result.counterId.toString());
      this.form.get("porcentajeMetropolitan").setValue(result.porcentajeMetropolitana);
    });

  }

  saveOperador() {
    this.operador.name = this.form.get("nombreOperador").value;
    this.operador.telefono = this.form.get("telefonoOperador").value;
    this.operador.direccion = this.form.get("direccionOperador").value;
    this.operador.porcentajeArgentina = this.form.get("porcentajeArgentina").value;
    this.operador.porcentajeAgencia = this.form.get("porcentajeAgencia").value;
    //this.operador.counterId = this.form.get("counter").value;
    this.operador.porcentajeMetropolitana = this.form.get("porcentajeMetropolitan").value;
    if (this.isEdit) {
      this.operador.id = this.operadorId;
      this.operadorService.updateOperador(this.operador).subscribe((data) => {
        this.router.navigate(['/main/operador']);
      });
    }
    else {
      this.operadorService.saveOperadorItem(this.operador).subscribe((data) => {
        this.router.navigate(['/main/operador']);
      });
    }
  }

  calculateData() {

    let val1 = this.form.get("porcentajeMetropolitan").value;
    let val2 = this.form.get("porcentajeArgentina").value;
    let val3 = this.form.get("porcentajeAgencia").value;

    if ((val1 + val2 + val3) > 100) {
      this.porcentajeValido = false;
    }
    else {
      this.porcentajeValido = true;
    }
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }
}
