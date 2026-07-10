import { Component, OnInit } from '@angular/core';
import { CounterService } from '../../services/counter.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-counterlistpaquetes',
  templateUrl: './counterlistpaquetes.component.html',
  styleUrls: ['./counterlistpaquetes.component.css']
})
export class CounterlistpaquetesComponent implements OnInit {
  listOfData = [];
  waitAction: boolean = false;
  public searchText: string;

  constructor(
    private counterService: CounterService,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.chargeDataCLient();
  }

  chargeDataCLient() {
    this.waitAction = true;
    this.counterService.getCounterBySucursalPaquet(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfData = data;
      this.waitAction = false;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteCounter(idCounter) {
    this.counterService.deleteCounterPaquetesItem(idCounter).subscribe(item => {
      this.chargeDataCLient();
    });
  }
}
