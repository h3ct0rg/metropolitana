import { Claim } from './claim';

export interface Role {
    id: string;
    name: string;
    claims: Claim[];
}
