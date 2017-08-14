"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LSKey_Package_Explorer_Width = 'Package_Explorer_Width';
exports.LSKey_Content_Split_LeftSide_Width = 'Content_Split_LeftSide_Width';
exports.LSKey_Package_Explorer_Packages = 'Package_Explorer_Packages';
exports.LSKey_Settings_Theme = 'Settings_Theme';
exports.Default_Package_Explorer_Width = 260;
exports.Default_Content_Split_LeftSide_Width = 360;
exports.Default_Settings_Theme = 'dark-theme';
exports.PS_Packagest = [
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
    }
];
exports.appThemes = [
    {
        name: "Dark Theme",
        class_name: "dark-theme",
        image: "dark-theme.jpg"
    },
    {
        name: "Light Theme",
        class_name: "light-theme",
        image: "light-theme.jpg"
    }
];
