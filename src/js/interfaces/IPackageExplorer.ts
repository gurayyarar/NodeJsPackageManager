export interface IPackageExplorer {
    caption: string;
    path: string;
    packageManager: string;
    canDelete: boolean;
    isExistDevDependencies: boolean; 
}