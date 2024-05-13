import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatResult',
    standalone: true
})
export class FormatResultPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;

    // Count (just a number)
    if (/^\d+$/.test(value)) {
    return this.removeLeadingZero(value);
    }

    // Time (hh:mm:ss:msmsms)
    if (/^\d{2}:\d{2}:\d{2}:\d{3}$/.test(value)) {
        value = this.removeLeadingZero(value);
    return this.formatTime(value);
    }

    // Distance (kmkmkm:mmm:cmcm)
    if (/^\d{3}:\d{3}:\d{2}$/.test(value)) {
        value = this.removeLeadingZero(value);
    return this.formatDistance(value);
    }

    return value;

  }

  removeLeadingZero(value: string): string {
    // Remove leading zeros
    let formattedValue = value
    
    while (formattedValue.startsWith('0') && formattedValue.length > 1) {
        formattedValue = formattedValue.replace(/^0+/, '');
        // If there's a colon within the leading zeros, remove it
        if (formattedValue.startsWith(':')) {
            formattedValue = formattedValue.slice(1);
        }
    }

    return formattedValue;
    }

    formatTime(value: string): string {
        // count amount of : to determine the time, 0 = ms, 1 = s, 2 = m, 3 = h
        const timeArray = value.split(':');
        const timeArrayLength = timeArray.length;
        switch (timeArrayLength - 1) {
            case 0:
                return `${value} ms`;
            case 1:
                return `${value} s`;
            case 2:
                return `${value} min`;
            case 3:
                return `${value} h`;
            default:
                return `${value}`;
        }
    }

    formatDistance(value: string): string {
        // count amount of : to determine the distance, 0 = cm, 1 = m, 2 = km
        value = value.replaceAll(':', '.');
        const distanceArray = value.split('.');
        const distanceArrayLength = distanceArray.length;
        switch (distanceArrayLength - 1) {
            case 0:
                return `${value} cm`;
            case 1:
                return `${value} m`;
            case 2:
                return `${value} km`;
            default:
                return `${value}`;
        }
    }
}