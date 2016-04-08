'use strict';

var reviewsFilter = document.querySelector('.reviews-filter');

var templateElement = document.querySelector('#review-template');
var reviewsContainer = document.querySelector('.reviews-list');
var elementToClone;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

/*
 * Скрывает филтры до загрузки списка отзывов
 */
reviewsFilter.classList.add('invisible');

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {
  var clonedReview = elementToClone.cloneNode(true);

  /*
   * Number of rating stars
   */
  if (data.rating > 1) {
    if (data.rating === 2) {
      clonedReview.querySelector('.review-rating').classList.add('review-rating-two');
    } else if (data.rating === 3) {
      clonedReview.querySelector('.review-rating').classList.add('review-rating-three');
    } else if (data.rating === 4) {
      clonedReview.querySelector('.review-rating').classList.add('review-rating-four');
    } else {
      clonedReview.querySelector('.review-rating').classList.add('review-rating-five');
    }
  }
  /*
   * Review text
   */
  clonedReview.querySelector('.review-text').textContent = data.description;
  container.appendChild(clonedReview);

  /*
   * Review Avatar
   */
  var reviewImg = new Image();
  var imgLoadTimeout;
  var IMG_LOAD_TIMEOUT = 10000;

  /*
   * При успешной загрузке картинки,
   * удаляется timeout
   */
  reviewImg.onload = function() {
    clearTimeout(imgLoadTimeout);
    var img = clonedReview.querySelector('.review-author');
    img.src = data.author.picture;
    img.title = data.author.name;
    img.alt = data.author.name;
    img.width = 124;
    img.height = 124;
  };

  reviewImg.onerror = function() {
    clonedReview.classList.add('review-load-failure');
  };

  reviewImg.src = data.author.picture;

  /*
   * Показывает фильтры при загрузке списка отзывов
   */
  reviewsFilter.classList.remove('invisible');

  /*
   * Если картинка не загрузилась,
   * через 10 секунд срабатывает функция setTimeout
   */
  imgLoadTimeout = setTimeout(function() {
    reviewImg.src = '';
    clonedReview.classList.add('review-load-failure');
  }, IMG_LOAD_TIMEOUT);

  return clonedReview;
};

/**
 * @param {HTMLElement}
 */
window.reviews.forEach( function(review) {
  getReviewElement(review, reviewsContainer);
});
