import { Injectable } from '@angular/core';

@Injectable()
export class ConvertService {
    constructor() {}

    public fromSquareMeterToSquareMile = (squareMeter: number): number => squareMeter / Number('2,59e+6');

    public fromAcreToSquareMile = (acre: number): number => {
        const mileValueConvert = 640;
        return acre / mileValueConvert;
    }

    public fromAcreToSquareMeter = (acre: number): number => {
        const squareMeterValueConvert = 4046.8564;
        return acre * squareMeterValueConvert;
    }
}