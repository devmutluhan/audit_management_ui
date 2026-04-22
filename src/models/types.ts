export type Density = 'compact' | 'comfortable';
export type LocationTooltip = 'end' | 'start' | 'bottom' | 'top';

export class GeneralDropdownType {
	constructor() {
		this.id = 0
		this.title = '';
		this.icon = '';
		this.action = () => { };
		this.to = '';
		this.confirmModalValue = {};
		this.targetBlank = false;
		this.isVisible = true;
	}
	id?: number;
	title: string;
	icon?: string;
	action?: Function;
	to?: string;
	confirmModalValue?: ConfirmModalType;
	targetBlank?: boolean;
	isVisible?: boolean;
}

export class ConfirmModalType {
	constructor() {
		this.title = '';
		this.icon = '';
		this.text = '';
		this.confirmButtonText = '';
		this.cancelButtonText = '';
		this.action = () => { };
		this.descriptionField = '';
		this.buttonLoading = false;
		this.isDescriptionField = false;
	}
	title?: string;
	text?: string;
	icon?: string;
	confirmButtonText?: string;
	cancelButtonText?: string;
	action?: Function;
	buttonLoading?: boolean;
	descriptionField?: string;
	isDescriptionField?: boolean;
}

export class FilterOptionType {
	constructor() {
		this.filters = [];
		this.action = () => { };
		this.getItems = () => { };
		this.active = false;
	}
	filters: Array<FilterItemsType>;
	action: Function;
	active: boolean;
	getItems?: Function
}

export class ActiveFiltersType {
	constructor() {
		this.value = "";
		this.field = ""
	}
	value: string | number | number[] | string[] | any
	field: string | string[] | any;
}

export class SelectFieldProp extends ActiveFiltersType {
	constructor() {
		super()
		this.fieldTitle = ''
		this.fieldValue = ''
	}
	fieldTitle?: string
	fieldValue?: string
}

export class FilterItemsType extends SelectFieldProp {
	constructor() {
		super()
		this.type = FilterItemTypeEnum.Text;
		this.title = '';
		this.items = [];
		this.components = null;
		this.isEnum = true;
	}
	type: FilterItemTypeEnum;
	title?: string;
	items?: Array<SelectOptionType> | any;
	components?: null | any
	isEnum?: boolean
}

export class SelectOptionType {
	constructor() {
		this.value = 0;
		this.title = '';
	}
	value: number;
	title: string;
}

export enum FilterItemTypeEnum {
	Text,
	SingleSelect,
	MultipleSelect,
	Switch,
	Date,
	NumberRange,
	DateRange,
}