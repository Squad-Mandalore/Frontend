import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HeadlinesService {
    private _headlines = new BehaviorSubject<{ title: string, subtitles: string[] }[]>([]);
    public headlines = this._headlines.asObservable();

    setHeadlines(headlines: { title: string, subtitles: string[] }[]) {
        this._headlines.next(headlines);
    }
}