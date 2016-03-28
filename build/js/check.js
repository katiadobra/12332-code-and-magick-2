'use strict';

/**
 *  getMessage(a:*, b:*=):string
 *
 */

function getMessage(a, b) {

  if (typeof(a) === 'boolean') {
    if (a === true) {
      return 'Я попал в ' + b;
    } else {
      return 'Я никуда не попал';
    }
  }

  if (typeof(a) === 'number') {
    return 'Я прыгнул на ' + (a * 100) + ' сантиметров';
  }

  if (Array.isArray(a)) {

    if (Array.isArray(b)) {
      var length = 0;

      for (var i = 0; i < b.length; i++) {
        length += b[i] * a[i];
      }
      return 'Я прошёл ' + length + ' метров';

    }

    else {
      var sum = 0;

      for (var i = 0; i < a.length; i++) {
        sum += a[i];
      }
      return 'Я прошёл ' + sum + ' шагов';
    }
  }

  return 'Ничего не произошло.';
}
