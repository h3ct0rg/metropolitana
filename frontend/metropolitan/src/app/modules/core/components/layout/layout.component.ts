import { Component, OnInit, OnDestroy, AfterContentInit, HostListener } from '@angular/core';
import { Router, Event, ActivatedRoute } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { isArray } from 'util';
import { AuthenticationService } from '../../../security/services/authentication.services';
import { FilterService } from './../../../../shared/services/ui/filter.service';
import { StorageService } from './../../../../shared/services/local-data/storage.service';
import { IStorageKeys } from './../../../../shared/services/local-data/storage';
import { CoreUiService } from '../../services/ui/core-ui.service';
import { UsuarioService } from '../../services/usuario.service';
import { TipoCambioService } from '../../services/tipo-cambio.services';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
  providers: [AuthenticationService]
})
export class LayoutComponent implements OnInit, OnDestroy, AfterContentInit {
  isCollapsed = false;
  listCatalogs: any[] = [];
  permission: true;
  showSettingsMenu: boolean;
  subscriptions: Subscription = new Subscription();
  userName: string;
  userId: number;
  nombreUsuario: string;
  screenWidth: number;
  tipoCambioActual: number;
  @HostListener('window:load') setBrowserRefreshingFn() {
    this.showSettingsMenu = this.router.url.includes('settings');
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private filterService: FilterService,
    public coreUIService: CoreUiService,
    private storageService: StorageService,
    private userService: UsuarioService,
    private tipoCambioService: TipoCambioService
  ) { }

  ngOnInit() {
    this.setUserName();
    this.setShowingSettingsMenuConfig();
    this.getScreenSize();
    this.tipoCambioService.getActual().subscribe(result => {
      this.tipoCambioActual = result ? result.valor : null;
    });
  }

  @HostListener('window:resize')
  getScreenSize() {
    this.screenWidth = window.innerWidth;
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  compareCommoditiesData = (o1: any, o2: any) => (o1 && o2 ? o1.commodityId === o2.commodityId : o1 === o2);
  compareTenantsData = (o1: any, o2: any) => (o1 && o2 ? o1.tenantId === o2.tenantId : o1 === o2);

  handleSettingsClick() {
    this.router.navigate(['main/settings']);
  }

  setUserName = () => {
    const token = this.storageService.parse(IStorageKeys.Token);
    this.userName = token['userName'];
    this.userService.getUser(token['userId']).subscribe(item => {
      this.nombreUsuario = item['nombre'];
      this.userId = item['id'];
    });

  }

  setShowingSettingsMenuConfig() {
    this.subscriptions.add(
      this.coreUIService.showSettingsMenu$.subscribe(show => {
        this.showSettingsMenu = show;
      })
    );
  }

  isAdmin(listRolesPermited) {
    const userRoles = this.getActualUserRole();
    let granted = false;

    if (isArray(userRoles)) {
      userRoles.forEach(element => {
        if (listRolesPermited.includes(element)) {
          granted = true;
        }
      });
    } else {
      if (listRolesPermited.includes(userRoles)) {
        granted = true;
      }
    }

    return granted;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/']);
  }

  getActualUserRole() {
    const token = this.storageService.parse(IStorageKeys.Token);
    const tokenInfo = this.authenticationService.getDecodedAccessToken(token);
    return token.userType.split(',');
  }

  // Events
  // Events

  onCollapseMenu() {
    this.isCollapsed = !this.isCollapsed;
    this.filterService.saveLayoutShrinkValue(this.isCollapsed);
  }
}
