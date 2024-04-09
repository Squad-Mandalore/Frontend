import { animate, style, transition, trigger } from "@angular/animations";

export const enterLeaveAnimation = trigger('enterAnimation', [
            transition(':enter', [
                style({opacity: 0}),
                animate('200ms')
            ]),
            transition(':leave', [
                animate('200ms', style({opacity: 0}))
            ])
        ]);
