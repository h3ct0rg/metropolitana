export class FarmerListFilter {
}
export enum IFarmersEditTable {
    FarmerName = 'farmerName',
    DocumentType = 'documentType',
    DocumentNumber = 'documentNumber',
    ProducerType = 'producerType',
    HouseHoldMembersCount = 'houseHoldMembersCount',
    DrinkableWater = 'drinkableWater',
    FarmIsSourceOfIncome = 'farmIsSourceOfIncome',
    PersonType = 'personType',
    ProfileStatus = 'profileStatus'
}
export interface IFarmersEditTableMap {
    farmerName: boolean;
    documentType: boolean;
    documentNumber: boolean;
    producerType: boolean;
    houseHoldMembersCount: boolean;
    drinkableWater: boolean;
    farmIsSourceOfIncome: boolean;
    personType: boolean;
    profileStatus: boolean;
}
