export interface IButton {
    title: string;
    type: ButtonType;
    icon: string;
    iconType: IconType;
    height: string;
    width: string;
    fontSize: string;
    fontWeight: string;
    dropdown?: IDropdownButton;
    onClick: () => void;
}

export interface IDropdownButton {
    name: string;
    position: string;
    trigger: string;
    disabled: boolean;
    isIconOnly: boolean;
    data: any[];
}

export enum IconType {
    NzIcon,
    NzCustomIcon,
    CustomIcon
}

export enum ButtonType {
    Default = 'default',
    Dropdown = 'dropdown',
    Link = 'link'
}

export class PageHeaderButton {
    static Factory = class {
        public static CreatePageHeaderButtonWithNzIcon(buttonTitle: string,
                                                       buttonIcon: string,
                                                       handleOnClick: any,
                                                       buttonType: ButtonType = ButtonType.Default,
                                                       dropdown: IDropdownButton = null): PageHeaderButton {
            return new PageHeaderButton(buttonTitle,
                                        buttonIcon,
                                        IconType.NzIcon,
                                        '',
                                        '',
                                        '',
                                        '',
                                        handleOnClick,
                                        buttonType,
                                        dropdown);
        }
        public static CreatePageHeaderButtonWithNzCustomIcon(buttonTitle: string,
                                                             buttonIcon: string,
                                                             buttonIconFontSize: string,
                                                             buttonTitleFontWeight: string,
                                                             handleOnClick: any,
                                                             buttonType: ButtonType = ButtonType.Default,
                                                             dropdown: IDropdownButton = null): PageHeaderButton {
            return new PageHeaderButton(buttonTitle,
                                        buttonIcon,
                                        IconType.NzCustomIcon,
                                        '',
                                        '',
                                        buttonIconFontSize,
                                        buttonTitleFontWeight,
                                        handleOnClick,
                                        buttonType,
                                        dropdown);
        }

        public static CreatePageHeaderButtonWithCustomIcon(buttonTitle: string,
                                                           buttonIcon: string,
                                                           imageHeight: string,
                                                           imageWidth: string,
                                                           buttonTitleFontWeight: string,
                                                           handleOnClick: any,
                                                           buttonType: ButtonType,
                                                           dropdown: IDropdownButton = null): PageHeaderButton {
            return new PageHeaderButton(buttonTitle,
                                        buttonIcon,
                                        IconType.CustomIcon,
                                        imageHeight,
                                        imageWidth,
                                        '',
                                        buttonTitleFontWeight,
                                        handleOnClick,
                                        buttonType,
                                        dropdown);
        }
    };

    private _button: IButton;
    public get button(): IButton {
        return this._button;
    }

    private constructor(buttonTitle: string,
                        buttonIcon: string,
                        buttonIconType: IconType,
                        imageHeight: string,
                        imageWidth: string,
                        imageFontSize: string,
                        titleFontWeight: string,
                        handleOnClick: any,
                        buttonType: ButtonType,
                        dropdown?: IDropdownButton) {
        this._button = {
            title: buttonTitle,
            type: buttonType,
            icon: buttonIcon,
            iconType: buttonIconType,
            height: imageHeight,
            width: imageWidth,
            fontSize: imageFontSize,
            fontWeight: titleFontWeight,
            dropdown,
            onClick: handleOnClick
        };
    }
}
