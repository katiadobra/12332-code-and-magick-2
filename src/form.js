'use strict';

(function() {

  var DEFAULT_MARK = 3;
  var mark = DEFAULT_MARK;

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


  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

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


  formReviewRatingMarks.addEventListener('change', function(e) {
    mark = e.target.value;
    formValidation();
  });

  formReviewName.addEventListener('input', formValidation);

  formReviewText.addEventListener('input', formValidation);
  formValidation();
})();
