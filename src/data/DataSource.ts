export interface DataSource<T> {
    get(): Promise<T>;
}