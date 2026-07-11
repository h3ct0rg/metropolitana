import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from '../../../../shared/services/local-data/storage';

@Component({
  selector: 'app-main-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {

  isAdmin: boolean = false;

  constructor(private storage: StorageService) { }

  ngOnInit() {
    this.isAdmin = this.getTokenUserIsAdmin();
  }

  getTokenUserIsAdmin(): boolean {
    const token = this.storage.parse(IStorageKeys.Token);
    const userType = token['userType'];
    const arrayUserType = userType.split(',');
    return arrayUserType.includes("1");
  }
}
