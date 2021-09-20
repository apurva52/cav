import { deprecate } from 'util';

export interface AppError {

    // Depricated
    error?: string;

    // Depricated
    message?: string;

    msg?: string;
    code?: string;
}
