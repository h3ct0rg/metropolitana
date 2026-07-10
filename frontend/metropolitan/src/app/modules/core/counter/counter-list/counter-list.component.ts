import { Component, OnInit } from '@angular/core';
import { CounterService } from '../../services/counter.services';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'counter-list',
  templateUrl: './counter-list.component.html',
  styleUrls: ['./counter-list.component.css']
})
export class CounterListComponent implements OnInit {
  listOfData = [];
  waitAction: boolean = false;
  public searchText: string;

  constructor(
    private counterService: CounterService,
    private storageService: StorageService
  ) {
  }

  ngOnInit() {
    this.chargeDataCLient();
  }

  chargeDataCLient() {
    this.waitAction = true;
    this.counterService.getCounterBySucursal(this.getActualSucursal()).subscribe((data: []) => {
      this.listOfData = data;
      this.waitAction = false;
    });
  }

  getActualSucursal() {
    const token = this.storageService.parse(IStorageKeys.Token);
    return token.sucursal;
  }

  deleteCounter(idCounter) {
    this.counterService.deleteCounterItem(idCounter).subscribe(item => {
      this.chargeDataCLient();
    });
  }

}
