export interface IPackageDetail {
    name: string;
    author?: string;
    license?: string;
    description?: string;
    versions?: string[];
    version?: string;
    readMe?: string;
    contributors?: any;
    dependencies?: any;
    devDependencies?: any;
}