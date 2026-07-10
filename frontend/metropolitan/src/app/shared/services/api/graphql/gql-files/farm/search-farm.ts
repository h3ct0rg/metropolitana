import gql from 'graphql-tag';

export class SearchFarm {
}

export const SEARCH_FARM = gql`
    query SearchFarm($searchString: String! $pageIndex: Int = 1 $pageSize: Int = 20){
        searchFarms(
        searchString: $searchString,
        pageIndex: $pageIndex,
        pageSize: $pageSize
        ){
            farmDenormalizedId
            farmId
            producerId
            locale
            landId
            farmCode
            farmName
            totalArea
            productiveArea
            createdBy
        }
    }
`;
