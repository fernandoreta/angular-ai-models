export interface IModels {
    title: string;
    action?: () => void;
    navigate?: () => void;
    show?: boolean;
}

export interface ISavedText {
    name: string;
    type: Types;
    content: string;
}

export enum Types {
    Book = 'Book',
    Article = 'Article'
}

export interface IUser {
    name?: string;
    email: string;
    password: string;
}
