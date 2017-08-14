export interface IPackageCommand {
    packages: string[];
    dependsOn?: string[];
    isDevDependency?: boolean;
    packagePath?: string;
    isGlobal?: boolean;
}