import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'interpolateValues'
})
export class InterpolateValuesPipe implements PipeTransform {

  transform(value: string, interpolation: any[]): string {
    return interpolation.reduce((text, newValue, index) => {
      return text.replace(`{${index}}`, newValue);
    }, value);
  }

}
