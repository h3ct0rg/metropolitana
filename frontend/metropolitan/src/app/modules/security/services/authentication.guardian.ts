import { Injectable, Self, Inject, SkipSelf } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { StorageService } from './../../../shared/services/local-data/storage.service';
import { IStorageKeys } from './../../../shared/services/local-data/storage';

@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(private storage: StorageService, public router: Router) { }

    public isAuthenticated(): boolean {
      const token = this.storage.parse(IStorageKeys.Token);
      return true;
    }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const { roles } = route.data;
        const currentUserToken = IStorageKeys.CurrentUser;
        const currentUser = this.storage.get(currentUserToken);
        if (currentUser) {
            if (!this.isAuthenticated()) {
                this.router.navigate(['login']);
            }
            const parsedUser = this.storage.parse(currentUserToken);
            const token = this.storage.parse(IStorageKeys.Token);
            const match = this.roleMatch(roles);
            if (match) {
                const tokenInfo = this.getDecodedAccessToken(token);
                return true;
            }
        }
        console.log(`This user doesn't have enough permissions to access in this section`);
        return false;
    }

    roleMatch(allowedRoles: string[]): boolean {
        let isMatch = false;
        const currentUser = this.storage.parse(IStorageKeys.TokenInfo);
        const userRoles = "web.access";
        allowedRoles.forEach(element => {
            if (userRoles.includes(element)) {                
                isMatch = true;
            }
        });
        return isMatch;
    }
    getDecodedAccessToken(token: string): string {
        try {
            return jwt_decode(token);
        } catch (Error) {
            return null;
        }
    }
}
