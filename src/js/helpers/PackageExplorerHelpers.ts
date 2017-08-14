import { IPackageExplorer } from '../interfaces/IPackageExplorer';
import { LSKey_Package_Explorer_Packages, PS_Packagest } from './ConstantHelpers';

export class PackageExplorerHelpers {
    getListItem(packageManager: string): IPackageExplorer[] {
        const packs: IPackageExplorer[] = this.getAllItems();

        let result: IPackageExplorer[] = $.grep(packs, (key, i) => {
            return key.packageManager === packageManager;
        });

        if (packageManager === 'npm') {
            result.push({
                caption: 'Global Packages',
                path: null,
                packageManager: packageManager,
                canDelete: false,
                isExistDevDependencies: false
            });
        }

        return result.reverse();
    }

    add(packageManager: string, path: string) {
        let packs: IPackageExplorer[] = this.getAllItems();

        packs.push({
            caption: path,
            canDelete: true,
            packageManager: packageManager,
            path: path,
            isExistDevDependencies: $.grep(PS_Packagest, (val: any, i: number) => {
                return val.packageManager === packageManager;
            })[0].isExistDevDependencies
        });

        localStorage.setItem(LSKey_Package_Explorer_Packages, JSON.stringify(packs));
    }

    remove(path: string) {
        const packs: IPackageExplorer[] = this.getAllItems();

        let result: IPackageExplorer[] = $.grep(packs, (key, i) => {
            return key.path !== path;
        });

        localStorage.setItem(LSKey_Package_Explorer_Packages, JSON.stringify(result));
    }

    removeAllList(packageManager: string) {
        const packs: IPackageExplorer[] = this.getAllItems();

        let result: IPackageExplorer[] = $.grep(packs, (key, i) => {
            return key.packageManager !== packageManager;
        });

        localStorage.setItem(LSKey_Package_Explorer_Packages, JSON.stringify(result));
    }

    isExist(path: string): boolean {
        const packs: IPackageExplorer[] = this.getAllItems();

        return $.grep(packs, (key, i) => {
            return key.path === path
        }).length > 0;
    }

    private getAllItems(): IPackageExplorer[] {
        let packs: string = localStorage.getItem(LSKey_Package_Explorer_Packages);
        return packs === null ? [] : <IPackageExplorer[]>JSON.parse(packs);
    }
}