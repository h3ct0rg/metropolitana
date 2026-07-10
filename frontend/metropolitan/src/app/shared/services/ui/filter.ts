export class Filter {
}

export interface ICheckBoxFilter {
    id?: string|number;
    type?: string;
    label: string;
    value: string;
    checked: boolean;
}

export interface IDataFilter<T> {
    id?: string|number;
    label?: string;
    data?: T;
}

export type CheckBoxFilterItems =
    IDataFilter<ICheckBoxFilter[]>
    | ICheckBoxFilter;

// Any kind of filter-based components could be added here
export type FilterComponents = CheckBoxFilterItems[];

export type FilterType = IDataFilter<FilterComponents>|ICheckBoxFilter;
// Save filtered values defined a custom interface
export enum FilterModuleType {
    FarmerList = 'farmerList',
    FarmerEdit = 'farmerEdit',
    FarmList = 'farmList'
}
export enum DefaultCheckedItems {
    ALL = 'all',
    DEFAULT = 'default'
}
export enum FilterWidthSizes {
    SMALL = 'small',
    LARGE = 'large'
}
export interface IFilterPresetFormat {
    name: string;
    filter: string[];
}
export interface ICheckedItemFormat {
    filtered: string[];
    count: number;
    default?: string[];
    preset?: IFilterPresetFormat[];
}
export interface ICheckedItemSubject {
    [key: string]: ICheckedItemFormat;
}
export interface IUIFilter<T> {
    [key: string]: T[];
}
export interface ICustomData<T> {
    [key: string]: T;
}
export type IUIFilterLike = FilterType|ICheckBoxFilter;

export type BSLike =
    ICustomData<boolean>
    | ICheckedItemSubject
    | IUIFilter<IUIFilterLike>
    | IUIFilter<ICheckBoxFilter>
    | IUIFilter<FilterType>;

export type BSValueLike =
    IUIFilterLike[]
    | IUIFilterLike
    | ICheckedItemFormat
    | FilterType
    | FilterType[]
    | ICheckBoxFilter
    | ICheckBoxFilter[]
    | boolean;

export interface IFilterButtons {
    link: string;
    submit: string;
}

export interface IFilter {
    checkedItems?: number;
    buttons: IFilterButtons;
    data: FilterType[];
    isCollapsed?: boolean;
    mode: string;
    subtitle?: string;
    title: string;
    type: string;
    widthSize: string;
}
