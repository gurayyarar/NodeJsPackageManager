import { IPackagest } from '../interfaces/IPackagest';

//Localstorage Keys
export const LSKey_Package_Explorer_Width: string = 'Package_Explorer_Width';
export const LSKey_Content_Split_LeftSide_Width: string = 'Content_Split_LeftSide_Width';
export const LSKey_Package_Explorer_Packages: string = 'Package_Explorer_Packages';
export const LSKey_Settings_Theme: string = 'Settings_Theme';

//Default Values
export const Default_Package_Explorer_Width: number = 260;
export const Default_Content_Split_LeftSide_Width: number = 360;
export const Default_Settings_Theme: string = 'dark-theme';

//Program Support
export const PS_Packagest: IPackagest[] = [
    {
        title: 'NODEJS PACKAGE MANAGER (NPM)',
        packageManager: 'npm',
        file: 'package.json',
        isExistDevDependencies: true
    },
    {
        title: 'BOWER',
        packageManager: 'bower',
        file: 'bower.json',
        isExistDevDependencies: false
    }];

//Themes
export const appThemes: any = [
    {
        name: "Dark Theme",
        class_name: "dark-theme",
        image: "dark-theme.jpg"
    },
    {
        name: "Light Theme",
        class_name: "light-theme",
        image: "light-theme.jpg"
    }];