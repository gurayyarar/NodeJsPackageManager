export interface IPackageControl {
    install: boolean;
    uninstall: boolean;
    loader?: boolean;
    update: boolean;
    reload: boolean;
    downgrade?: boolean;
}