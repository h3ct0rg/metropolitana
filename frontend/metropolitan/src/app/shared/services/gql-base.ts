import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { GraphqlClientService } from './graphql-client.service';

export class GqlBase<T> {
    constructor(protected graphQLClientService: GraphqlClientService) {}
    protected query = (data: any, variables?: any): Observable<T> => {
        const queryObj: {query: any, variables?: any} = {
            query: data
        };
        if (variables) {
            queryObj.variables = variables;
        }
        return from(this.getClient().watchQuery(queryObj).result())
            .pipe(map(response => response.data));
    }
    protected mutate = (data: any): Observable<T> => {
        return from(this.getClient().mutate({mutation: data}))
            .pipe(map(result => result.data));
    }
    private getClient = () => {
        return this.graphQLClientService.getClient();
    }
}
