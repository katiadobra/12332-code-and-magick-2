'use strict';


(function() {
  /** @constant {number} */
  var DEFAULT_MARK = 3;
  var mark = DEFAULT_MARK;

  var browserCookies = require('browser-cookies');

  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  var formReview = document.querySelector('.review-form');
  var formReviewRatingMarks = document.querySelector('.review-form-group-mark');
  var formReviewName = formReview.querySelector('#review-name');
  var formReviewSubmit = formReview.querySelector('.review-submit');

  var formReviewText = formReview.querySelector('#review-text');
  var reviewNameLabel = formReview.querySelector('.review-fields-name');
  var reviewTextLabel = formReview.querySelector('.review-fields-text');
  var reviewFormControl = formReview.querySelector('.review-form-control.review-fields');

  formReviewName.required = true;
  formReviewSubmit.disabled = true;

  /**
   * @param {Event} evt
   */
  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  /**
   * @param {Event} evt
   */
  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  /**
   * @function
   * @name formValidation
   */
  var formValidation = function() {
    var name = formReviewName.value;
    var text = formReviewText.value;
    // mark is global

    formReviewText.required = mark > 2 ? false : true;

    if (name) {
      reviewNameLabel.classList.add('invisible');
    } else {
      reviewNameLabel.classList.remove('invisible');
    }

    if (!formReviewText.required || text) {
      reviewTextLabel.classList.add('invisible');
    } else {
      reviewTextLabel.classList.remove('invisible');
    }

    if (!name || (formReviewText.required && !text)) {
      formReviewSubmit.disabled = true;
      reviewFormControl.classList.remove('invisible');
    } else {
      reviewFormControl.classList.add('invisible');
      formReviewSubmit.disabled = false;
    }
  };

  /**
   * Записываем значения полей из cookies, если они есть
   */
  formReviewName.value = browserCookies.get('name') || formReviewName.value;


  /**
   * Вызываем валидацию по загрузке страницы
   */
  formValidation();
  mark = browserCookies.get('mark') || DEFAULT_MARK;
  /**
   * Вызываем валидацию при изменении оценки
   * @param {Event} evt
   */
  formReviewRatingMarks.addEventListener('change', function(evt) {
    mark = evt.target.value;
    formValidation();

    browserCookies.set('mark', mark);
  });

  /**
   * Вызываем валидацию при изменении имени
   * и текста отзыва
   */
  formReviewName.addEventListener('input', formValidation);
  formReviewText.addEventListener('input', formValidation);

  /**
   * @param {Event} evt
   */
  formReview.onsubmit = function(evt) {
    evt.preventDefault();

    browserCookies.set('name', formReviewName.value);
    browserCookies.set('mark', mark);

    this.submit();
  };
})();
