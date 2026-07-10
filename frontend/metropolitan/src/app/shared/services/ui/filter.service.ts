import { Injectable, ComponentFactoryResolver, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    FilterType,
    IDataFilter,
    ICheckBoxFilter,
    ICheckedItemSubject,
    FilterModuleType,
    CheckBoxFilterItems,
    DefaultCheckedItems,
    IUIFilter,
    IFilterPresetFormat,
    BSValueLike,
    ICustomData,
    BSLike
} from './filter';
import { IFarmersEditTable, IFarmersEditTableMap } from './farmer-list-filter';

type EntryDirectives = "";

@Injectable()
export class FilterService {
    static activeFilter$: BehaviorSubject<string>;
    static filterType$: BehaviorSubject<string>;
    static layoutShrink$: BehaviorSubject<ICustomData<boolean>>;
    checkedItems$: BehaviorSubject<ICheckedItemSubject>;
    defaultUIFilters$: BehaviorSubject<IUIFilter<ICheckBoxFilter>>;
    uiFilters$: BehaviorSubject<IUIFilter<FilterType>>;
    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        FilterService.activeFilter$ = new BehaviorSubject(null);
        FilterService.layoutShrink$ = new BehaviorSubject(null);
        FilterService.filterType$ = new BehaviorSubject(null);
        this.checkedItems$ = new BehaviorSubject(null);
        this.defaultUIFilters$ = new BehaviorSubject(null);
        this.uiFilters$ = new BehaviorSubject(null);
    }
    getComponentReference =
        (entryDirective: EntryDirectives, component: Type<any>) => {
            const componentFactoryResolver = this.componentFactoryResolver.resolveComponentFactory(component);
            const viewContainerRef = "";
            return viewContainerRef;
        }
    removeComponentReference =
        (entryDirective: EntryDirectives): void => {
            const viewContainerRef = "";
            viewContainerRef;
        }
    createCheckedItemsConfig = (data: FilterType[]): void => {
        const filteredData = this.getCheckedItems(data);
        const checkedItemsConfig = {
            filtered: [...filteredData],
            count: filteredData.length,
            default: [],
            preset: []
        };
        this.createInitialSubject(this.checkedItems$, checkedItemsConfig);
    }
    createDefaultCheckboxesConfig = (data: ICheckBoxFilter[]): void => {
        this.createInitialSubject(this.defaultUIFilters$, data);
    }
    createFilterTypeConfig = (type: string): void => {
        FilterService.filterType$.next(type);
    }
    createLayoutShrinkConfig = (): void => {
        this.createInitialSubject(FilterService.layoutShrink$, false);
    }
    createInitialSubject = (subject$: BehaviorSubject<BSLike>, data: BSValueLike): void => {
        const type = this.getFilterTypeValue();
        const subjectValue = subject$.getValue();
        if (!subjectValue) {
            subject$.next({ [type]: data } as BSLike);
        } else if (!subjectValue[type]) {
            subject$.next({
                ...subjectValue,
                [type]: data
            } as BSLike);
        }
    }
    createUIFiltersConfig = (data: FilterType[]): void => {
        this.createInitialSubject(this.uiFilters$, data);
    }
    getActiveFilter = (): string => {
        return FilterService.activeFilter$.getValue();
    }
    getCheckedItems = (data: FilterType[]): string[] => {
        return data
            .reduce((arr, item: IDataFilter<ICheckBoxFilter[]>, index, collection) => {
                if ((item as IDataFilter<ICheckBoxFilter[]>).data) {
                    return [...arr, ...this.findCheckedOnly(item.data as ICheckBoxFilter[])];
                }
                if (arr.length === 0) {
                    return [...arr, ...this.findCheckedOnly(collection as ICheckBoxFilter[])];
                }
                return arr;
            }, [])
            .map(item => item.value);
    }
    getCheckedItemsAsPreset = (filterName: string): IFilterPresetFormat => {
        const type = this.getFilterTypeValue();
        const checkedItemsValue = this.checkedItems$.getValue();
        const uiFiltersValue = this.getSubjectValue(this.uiFilters$) as IUIFilter<FilterType>;
        const uiFilterType: FilterType[] = uiFiltersValue[type];
        const checkedItems = this.getCheckedItems(uiFilterType);
        const newData: IFilterPresetFormat = { name: filterName, filter: checkedItems };
        const newCollection = [newData];
        // TODO Analyze if it is necessary to save preset on subject to then send its data to its API
        this.checkedItems$.next({
            ...checkedItemsValue,
            [type]: {
                ...checkedItemsValue[type],
                preset: [
                    ...checkedItemsValue[type].preset,
                    ...newCollection
                ]
            }
        });
        return newData;
    }
    getCurrentFilterType = (component: any) => {
        const activeFilter = component.filterConfig.type;
        const activeFilterValue = this.getActiveFilter();
        const filterType = this.getFilterTypeValue();
        let type = filterType;
        if (filterType !== activeFilterValue || filterType !== activeFilter) {
            type = activeFilter;
            this.setActiveFilter(activeFilter);
            this.createFilterTypeConfig(activeFilter);
        }
        return type;
    }
    getDefaultCheckboxes = (): ICheckBoxFilter[] => {
        return [
            {
                label: 'components.filter.childrenComponents.default.checkboxes.selectAll',
                value: DefaultCheckedItems.ALL,
                checked: false
            }
        ];
    }
    getDefaultCheckboxList = (): ICheckBoxFilter[] => {
        const type = this.getFilterTypeValue();
        const checkboxGroupTypes = {
            [FilterModuleType.FarmerList]: this.getDefaultCheckboxes(),
            [FilterModuleType.FarmList]: this.getDefaultCheckboxes(),
            [FilterModuleType.FarmerEdit]: this.getDefaultCheckboxes().map(item => {
                return {...item, checked: true};
            }) as ICheckBoxFilter[]
        };
        return checkboxGroupTypes[type];
    }
    getDefaultFilterList = (): FilterType[] => {
        const type = this.getFilterTypeValue();
        const filterTypes = {
            [FilterModuleType.FarmerList]: this.getFarmerListFilters(),
            [FilterModuleType.FarmList]: this.getFarmListFilters(),
            [FilterModuleType.FarmerEdit]: this.getFarmerEditFilters()
        };
        return filterTypes[type];
    }
    getFarmerEditTableList = (): string[] => {
        return Object.values(IFarmersEditTable);
    }
    getFarmerEditTableMap = (): IFarmersEditTableMap => {
        return this.getFarmerEditTableList().reduce((newMap, value) => {
            newMap[value] = true;
            return newMap;
        }, {}) as IFarmersEditTableMap;
    }
    getFarmerEditFilters = (): ICheckBoxFilter[] => {
        return this.getFarmerEditTableList().reduce((arr, value) => {
            return [...arr,
                {
                    label: `components.filter.modules.farmer.edit.values.${value}`,
                    value,
                    checked: true
                }
            ];
        }, []);
    }
    getFarmerListFilters = (): FilterType[] => {
        return [
            {
                label: 'components.filter.modules.farmer.list.values.typeOfProducer',
                data: [
                    { label: 'components.filter.modules.farmer.list.values.cacao',  value: 'cacao', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.coffee',  value: 'coffee', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.all',  value: 'allProducers', checked: false }
                ]
            },
            {
                label: 'components.filter.modules.farmer.list.values.numberOfHouseholdMembers',
                data: [
                    { label: 'components.filter.modules.farmer.list.values.fiveMembers',  value: 'fiveMembers', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.tenMembers',  value: 'tenMembers', checked: false },
                    {
                        label: 'components.filter.modules.farmer.list.values.twentyOrMoreMembers',
                        value: 'twentyOrMoreMembers',
                        checked: false
                    }
                ]
            },
            {
                label: 'components.filter.modules.farmer.list.values.typeOfPerson',
                data: [
                    { label: 'components.filter.modules.farmer.list.values.naturalPerson',  value: 'naturalPerson', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.legalPerson',  value: 'legalPerson', checked: false }
                ]
            },
            {
                label: 'components.filter.modules.farmer.list.values.drinkableWater',
                data: [
                    { label: 'components.filter.modules.farmer.list.values.yes',  value: 'yesDrinkable', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.no',  value: 'noDrinkable', checked: false },
                    { label: 'components.filter.modules.farmer.list.values.both',  value: 'bothDrinkable', checked: false },
                ]
            }
        ];
    }
    getFarmListFilters = (): FilterType[] => {
        return [
            {
                label: 'First filter',
                data: [
                    { label: 'CheckBox 1', value: 'check1', checked: false },
                    { label: 'CheckBox 2', value: 'check2', checked: false },
                    { label: 'CheckBox 3', value: 'check3', checked: false },
                ]
            },
            {
                label: 'Second filter',
                data: [
                    { label: 'CheckBox 1', value: 'check4', checked: false },
                    { label: 'CheckBox 2', value: 'check5', checked: false },
                    { label: 'CheckBox 3', value: 'check6', checked: false },
                ]
            },
            {
                label: 'Third filter',
                data: [
                    { label: 'CheckBox 1', value: 'check7', checked: false },
                    { label: 'CheckBox 2', value: 'check8', checked: false },
                    { label: 'CheckBox 3', value: 'check9', checked: false },
                ]
            },
            {
                label: 'Fourth filter',
                data: [
                    {
                        label: 'Sub filter',
                        data: [
                            { label: 'CheckBox 1', value: 'check10', checked: false },
                            { label: 'CheckBox 2', value: 'check11', checked: false },
                            { label: 'CheckBox 3', value: 'check12', checked: false },
                        ]
                    },
                    { label: 'CheckBox 2', value: 'check13', checked: false },
                ]
            }
        ];
    }

    getFilterTypeValue = () => {
        return FilterService.filterType$.getValue();
    }
    getSubjectValue = (subject$: BehaviorSubject<BSLike>): BSLike => {
        return subject$.getValue();
    }
    getSubjectValueByType = (subject$: BehaviorSubject<BSLike>): BSValueLike => {
        const type = this.getFilterTypeValue();
        return this.getSubjectValue(subject$)[type];
    }
    getSubjectValueByCurrentCmp = (component: any, subject$: BehaviorSubject<BSLike>): BSValueLike => {
        const type = this.getCurrentFilterType(component);
        return this.getSubjectValue(subject$)[type];
    }
    isAnyDefaultGroupCheckboxesChecked() {
        const defaultValues = this.getSubjectValueByType(this.defaultUIFilters$) as ICheckBoxFilter[];
        const defaultChecked = this.getCheckedItems(defaultValues);
        return defaultChecked.length > 0;
    }
    isCheckboxesList = (data: FilterType[]): data is ICheckBoxFilter[] => {
        return data.find(item => item.hasOwnProperty('checked')) != null;
    }
    saveCheckedItem = (component: any, data: ICheckBoxFilter): void => {
        const type = this.getCurrentFilterType(component);
        const subjectValue = this.checkedItems$.getValue();
        const filterModuleType = subjectValue[type];
        if (filterModuleType) {
            switch (data.value) {
                case DefaultCheckedItems.ALL: {
                    this.setAllItemsChecked(data.checked);
                    break;
                }
                case DefaultCheckedItems.DEFAULT: {
                    this.setDefaultItemsChecked(data.checked);
                    break;
                }
                default: {
                    this.setCheckedItem(data);
                    break;
                }
            }
        }
    }
    saveLayoutShrinkValue = (value: boolean) => {
        const type = this.getActiveFilter();
        const subjectValue = FilterService.layoutShrink$.getValue();
        const newSubjectValue: ICustomData<boolean> = Object.keys(subjectValue).reduce((newValue, key) => {
            newValue[key] = false;
            if (type === key) {
                newValue[key] = value;
            }
            return newValue;
        }, {});
        FilterService.layoutShrink$.next({
            ...newSubjectValue
        } as ICustomData<boolean>);
    }
    saveLayoutShrinkValueByFilter = (type: string, value: boolean) => {
        this.setActiveFilter(type);
        this.saveLayoutShrinkValue(value);
    }
    setActiveFilter = (type: string) => {
        FilterService.activeFilter$.next(type);
    }
    setAllUIItemsChecked = (): void => {
        const type = this.getFilterTypeValue();
        let newCollection: FilterType[] = (this.getSubjectValueByType(this.uiFilters$) as FilterType[]);
        if (this.isCheckboxesList(newCollection)) {
            newCollection = this.getAllUICheckboxItemsSetByValue(newCollection, true);
        } else {
            newCollection = newCollection.map(item => {
                return this.getSelectAllUIItems(item, true);
            });
        }
        const uiFiltersValue = this.getSubjectValue(this.uiFilters$) as IUIFilter<FilterType>;
        this.uiFilters$.next({
            ...uiFiltersValue,
            [type]: newCollection
        });
    }
    setAllUIItemsUnchecked = (): void => {
        const type = this.getFilterTypeValue();
        let newCollection: FilterType[] = this.getDefaultFilterList();
        if (this.isCheckboxesList(newCollection)) {
            newCollection = this.getAllUICheckboxItemsSetByValue(newCollection, false);
        } else {
            newCollection = newCollection.map(item => {
                return this.getSelectAllUIItems(item, false);
            });
        }
        const uiFiltersValue = this.getSubjectValue(this.uiFilters$) as IUIFilter<FilterType>;
        this.uiFilters$.next({
            ...uiFiltersValue,
            [type]: newCollection
        });
    }
    setAllItemsChecked = (isChecked: boolean): void => {
        if (isChecked) {
            this.setAllUIItemsChecked();
            this.setDefaultUICheckboxValueByType(DefaultCheckedItems.ALL);
        } else {
            this.setAllUIItemsUnchecked();
        }
        this.setDefinedCheckedItems({ isUserDefault: false, isPreset: false });
    }
    setCheckedItem = (data: ICheckBoxFilter): void => {
        const type = this.getFilterTypeValue();
        const subjectValue = this.checkedItems$.getValue();
        const filterModuleType = subjectValue[type];
        const checkedItemFound = filterModuleType.filtered.find(item => item === data.value);
        let newCollection = null;
        if (this.isAnyDefaultGroupCheckboxesChecked()) {
            this.setDefaultUICheckboxValuesUnchecked();
        }
        if (checkedItemFound) {
            newCollection = filterModuleType.filtered.filter(item => item !== data.value);
        } else {
            newCollection = [...filterModuleType.filtered, data.value];
        }
        this.checkedItems$.next({
            ...subjectValue,
            [type]: {
                ...subjectValue[type],
                filtered: newCollection,
                count: newCollection.length
            }
        });
    }
    setDefaultItemsChecked = (isChecked: boolean): void => {
        const type = this.getFilterTypeValue();
        if (isChecked) {
            // TODO Ask where default values are going to be persisted, by the moment it will be saved in checkedItems subject.
            this.setDefinedCheckedItems({ isUserDefault: isChecked, isPreset: false });
            this.setFilteredCheckItemsByName(this.checkedItems$.getValue()[type].default);
            this.setDefaultUICheckboxValueByType(DefaultCheckedItems.DEFAULT);
        } else {
            // TODO Check if it is necessary to set default values when "default" checkbox is unselected
            // this.setAllUIItemsUnchecked();
            // this.setDefinedCheckedItems({ isUserDefault: isChecked, isPreset: false });
        }
    }
    setDefaultUICheckboxValuesUnchecked = (): void => {
        const type = this.getFilterTypeValue();
        const defaultValues = this.getSubjectValue(this.defaultUIFilters$) as IUIFilter<ICheckBoxFilter>;
        const newCollection: ICheckBoxFilter[] = this.getAllUICheckboxItemsSetByValue(this.getDefaultCheckboxList(), false);
        this.defaultUIFilters$.next({
            ...defaultValues,
            [type]: newCollection
        });
    }
    setDefaultUICheckboxValueByType = (value: string): void => {
        const type = this.getFilterTypeValue();
        const defaultValues = this.getSubjectValue(this.defaultUIFilters$) as IUIFilter<ICheckBoxFilter>;
        const newCollection: ICheckBoxFilter[] = (defaultValues[type] as ICheckBoxFilter[]).map(item => {
            return { ...item, type, checked: item.value === value };
        });
        this.defaultUIFilters$.next({
            ...defaultValues,
            [type]: newCollection
        });
    }
    setDefinedCheckedItems = (options: { isUserDefault: boolean, isPreset: boolean }): void => {
        const type = this.getFilterTypeValue();
        const checkedItemsValue = this.checkedItems$.getValue();
        const checkedItems = this.getCheckedItems(this.getSubjectValueByType(this.uiFilters$) as FilterType[]);
        let checkedItemsObj = {
            ...checkedItemsValue[type],
            filtered: checkedItems,
            count: checkedItems.length
        };
        if (options.isUserDefault) {
            checkedItemsObj = {
                ...checkedItemsValue[type],
                filtered: checkedItems.length > 0 ? checkedItems : checkedItemsValue[type].default,
                count: checkedItems.length || checkedItemsValue[type].default.length,
                default: checkedItemsValue[type].filtered.length > 0 ?
                    checkedItemsValue[type].filtered : checkedItemsValue[type].default
            };
        }
        this.checkedItems$.next({
            ...checkedItemsValue,
            [type]: checkedItemsObj
        });
    }
    setFilteredCheckItemsByName = (data: string[]): void => {
        const type = this.getFilterTypeValue();
        const uiFiltersValue = this.getSubjectValue(this.uiFilters$) as IUIFilter<FilterType>;
        const uiFiltersData = uiFiltersValue[type];
        let newCollection: FilterType[] = null;
        if (this.isCheckboxesList(uiFiltersData)) {
            newCollection = data.length > 0 ?
                this.findCheckedOnlyByName(data, uiFiltersData as ICheckBoxFilter[])
                :   this.getDefaultFilterList();
        } else {
            newCollection = data.length > 0 ?
                uiFiltersData.map((item: CheckBoxFilterItems) => {
                    return this.getCheckItemsByName(data, item);
                }) : this.getDefaultFilterList();
        }
        this.uiFilters$.next({
            ...uiFiltersValue,
            [type]: newCollection
        });
    }
    setInitialConfig = (type: string, data: FilterType[]): void => {
        this.createFilterTypeConfig(type);
        this.createDefaultCheckboxesConfig(this.getDefaultCheckboxList());
        this.createUIFiltersConfig(data);
        this.createCheckedItemsConfig(data);
        this.createLayoutShrinkConfig();
    }
    private findCheckedOnly = (item: IDataFilter<ICheckBoxFilter[]> | ICheckBoxFilter[]): ICheckBoxFilter[] => {
        return (item as ICheckBoxFilter[]).reduce((newArray: ICheckBoxFilter[], it) => {
            if ((it as IDataFilter<ICheckBoxFilter>).data) {
                return [...newArray, ...this.findCheckedOnly((it as IDataFilter<ICheckBoxFilter>).data)];
            }
            if ((it as ICheckBoxFilter).checked) {
                return [...newArray, it];
            }
            return newArray;
        }, []);
    }
    private findCheckedOnlyByName = (values: string[], items: IDataFilter<ICheckBoxFilter[]> | ICheckBoxFilter[]): ICheckBoxFilter[] => {
        return (items as ICheckBoxFilter[]).reduce((newArray: ICheckBoxFilter[], it) => {
            if ((it as IDataFilter<ICheckBoxFilter>).data) {
                return [...newArray, ...this.findCheckedOnlyByName(values, (it as IDataFilter<ICheckBoxFilter>).data)];
            }
            if ((it as ICheckBoxFilter).value) {
                const foundItem = values.find(text => text === (it as ICheckBoxFilter).value);
                if (foundItem) {
                    return [...newArray, { ...it, checked: true }];
                }
                return [...newArray, { ...it, checked: false }];
            }
        }, []) as ICheckBoxFilter[];
    }
    private getCheckItemsByName = (values: string[], uiItem: IDataFilter<ICheckBoxFilter[]>): IDataFilter<CheckBoxFilterItems[]> => {
        return {
            ...uiItem,
            data: uiItem.data.map((item: CheckBoxFilterItems) => {
                if ((item as IDataFilter<ICheckBoxFilter>).data) {
                    return this.getCheckItemsByName(values, item);
                }
                if ((item as ICheckBoxFilter).value) {
                    const foundItem = values.find(text => text === (item as ICheckBoxFilter).value);
                    if (foundItem) {
                        return { ...item, checked: true };
                    }
                    return { ...item, checked: false };
                }
            }) as CheckBoxFilterItems[]
        } as IDataFilter<CheckBoxFilterItems[]>;
    }
    private getSelectAllUIItems = (item: IDataFilter<CheckBoxFilterItems[]>, value: boolean): IDataFilter<CheckBoxFilterItems[]> => {
        return {
            ...item,
            data: item.data.map(it => {
                if ((it as IDataFilter<ICheckBoxFilter[]>).data) {
                    return this.getSelectAllUIItems(it, value);
                }
                if ((it as ICheckBoxFilter).value) {
                    return { ...it, checked: value } as ICheckBoxFilter;
                }
            }) as CheckBoxFilterItems[]
        };
    }
    private getAllUICheckboxItemsSetByValue = (data: ICheckBoxFilter[], isChecked: boolean) => {
        return data.map(item => {
            return {...item, checked: isChecked};
        });
    }
}
