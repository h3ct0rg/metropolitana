import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { concat, ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from './../../../environments/environment';
import { StorageService } from './local-data/storage.service';
import { IStorageKeys } from './local-data/storage';
import ApolloClient from 'apollo-client';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class GraphqlClientService {
  static client$: BehaviorSubject<ApolloClient<any>> = new BehaviorSubject(null);
  constructor(private apollo: Apollo, private httpLink: HttpLink, private storage: StorageService) {
    const client = this.getClient();
    const token = this.storage.get(IStorageKeys.Token);
    if (!client && token) {
      const cache = new InMemoryCache();
      const http = this.httpLink.create({
        uri: ""//environment.baseGraphQLUrl
      });
      const authMiddleware = new ApolloLink((operation, forward) => {
        operation.setContext({
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        });
        return forward(operation);
      });
      this.apollo.create({
        cache,
        link: concat(authMiddleware, http)
      });
      this.setClient();
    }
  }
  public getClient = () => {
    return GraphqlClientService.client$.getValue();
  }
  private setClient = () => {
    GraphqlClientService.client$.next(this.apollo.getClient());
  }
}
