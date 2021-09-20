import {
    trigger,
    state,
    style,
    transition,
    animate,
  } from '@angular/animations';

export const messageAnimation = [
    trigger('messageState', [
      state(
        'visible',
        style({
          // transform: 'translateY(0)',
          opacity: 1,
          display: 'content',
        })
      ),
      transition('void => *', [
        style({ transform: '{{showTransformParams}}', opacity: 0 }),
        animate('{{showTransitionParams}}'),
      ]),
      transition('* => void', [
        animate(
          '{{hideTransitionParams}}',
          style({
            height: 0,
            opacity: 0,
            transform: '{{hideTransformParams}}',
            display: 'none',
          })
        ),
      ]),
    ]),
  ];