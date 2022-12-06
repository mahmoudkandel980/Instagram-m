export interface InputInterface {
    type: string;
    id: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent) => {};
    children: string;
    minLength: number;
    min: number;
    max: number;
}
