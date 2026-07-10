import { Component, OnInit } from '@angular/core';
import { NotaDebitoService } from '../../services/nota-debito.services';
import { FileService } from '../../services/file.services';
import { UploadFile } from 'ng-zorro-antd';
import { ClientService } from '../../services/clientes.service';
import { OperadorService } from '../../services/operador.services';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';
import { LogsService } from '../../services/Logs/logs.services';
import { Logs } from '../../../../shared/model/Logs';

@Component({
  selector: 'cargar-excel-nota-debito',
  templateUrl: './cargar-excel.component.html',
  styleUrls: ['./cargar-excel.component.css']
})
export class CargarExccelNotaDebitoComponent implements OnInit {
  listOfData = [];
  fileList: UploadFile[] = [];
  operadores = [] = [];
  clientes = [] = [];
  codOperador: string;
  uploading: string;
  waitAction = false;
  form: FormGroup;
  userID: string;
  logs: Logs;

  constructor(
    private notaDebitoService: NotaDebitoService,
    private router: Router,
    private fileService: FileService,
    private clienteService: ClientService,
    private operadoresService: OperadorService,
    private storageService: StorageService,
    private logService: LogsService
  ) {
    this.userID = this.getActualUserCode();
  }

  ngOnInit() {
    this.form = new FormGroup({
      codCliente: new FormControl(),
      codOperadorNormal: new FormControl(),
      codOperadorLowCost: new FormControl(),
      codOperadorAMP: new FormControl(),
      fechaRegistro: new FormControl(),
      codOperadorNacional: new FormControl()
    });

    this.clienteService.getClientList().subscribe(data => {
      this.clientes = data;
    });

    this.operadoresService.getOperadorBySucursal(this.getActualSucursal()).subscribe(data => {
      this.operadores = data;
    });

    this.logs = {
      id: "00000000-0000-0000-0000-000000000000",
      eventShoot: "Click Subir Archivo",
      fromEvent: "Upload Excel File",
      idSucursal: this.getActualSucursal(),
      itemUsed: "",
      userEvent: parseInt(this.userID),
      createDate: "1/1/2020 01:01:00"
    }
  }

  handleUpload() {
    let lccliente = this.form.get('codCliente').value;
    let lcoperadorNormal = this.form.get('codOperadorNormal').value;
    let lcoperadorLowCost = this.form.get('codOperadorLowCost').value;
    let lcoperadorAMP = this.form.get('codOperadorAMP').value;
    let lcoperadorNacional = this.form.get('codOperadorNacional').value;
    let lfechaRegistro = this.form.get('fechaRegistro').value;
    let month = "" + (lfechaRegistro.getMonth() + 1);
    let day = ("" + lfechaRegistro.getDate()).length > 1 ? lfechaRegistro.getDate() : "0" + lfechaRegistro.getDate();
    let fechaFinal = (month.length > 1 ? month : "0" + month) + '/' + day + '/' + lfechaRegistro.getFullYear();
    const formData = new FormData();
    this.fileList.forEach((file: any) => {
      formData.append('file', file);
      formData.append('codOperadorNormal', lcoperadorNormal);
      formData.append('codOperadorLowCost', lcoperadorLowCost);
      formData.append('codOperadorAMP', lcoperadorAMP);
      formData.append('codOperadorNacional', lcoperadorNacional);
      formData.append('codCliente', lccliente);
      formData.append('codSucursal', this.getActualSucursal());
      formData.append('userId', this.userID);
      formData.append('fechaRegistro', fechaFinal);
    });
    this.waitAction = true;

    this.fileService.uploadFile(formData).subscribe(data => {
      this.waitAction = false;
      this.logService.saveLogItem(this.logs).subscribe(sucess => {
        this.router.navigate(['./main/travelace/nota-debito']);
      });

    });
  }

  beforeUpload = (file: UploadFile): boolean => {
    this.fileList = this.fileList.concat(file);

    return false;
  };

  onChange() {

  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  getActualUserCode() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.userId;
  }

}
