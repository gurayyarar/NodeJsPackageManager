import { IPackageControl } from './IPackageControl';

export interface IPackage {
    name?: string;
    version?: string;
    alreadyInstalled?: boolean;
    listItemControl?: IPackageControl;
    detailControl?: IPackageControl;
    latestVersion?: string;
    selectedVersion?: string;
    isDevDependencies?: boolean;
}