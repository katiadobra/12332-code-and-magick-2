'use strict';

var reviewsFilter = document.querySelector('.reviews-filter');

var templateElement = document.querySelector('#review-template');
var reviewsContainer = document.querySelector('.reviews-list');
var moreBtn = document.querySelector('.reviews-controls-more');
var elementToClone;
/** @constant {number} */
var IMG_LOAD_TIMEOUT = 10000;
/** @constant {string} */
var HOTELS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';
/** @constant {number} */

/** @type {Array.<Object>} */
var reviews = [];

/** @type {Array.<Object>} */
var filteredReviews = [];

/** @enum {number} */
var Filter = {
  'ALL': 'reviews-all',
  'RECENT': 'reviews-recent',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad',
  'POPULAR': 'reviews-popular'
};

/** @constant {Filter} */
var DEFAULT_FILTER = Filter.ALL;
/** @constant {number} */
var PAGE_SIZE = 3;

/** @type {number} */
var pageNumber = 0;

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.review');
} else {
  elementToClone = templateElement.querySelector('.review');
}

/* Скрывает филтры до загрузки списка отзывов */
reviewsFilter.classList.add('invisible');

/**
 * @param {Object} data
 * @param {HTMLElement} container
 * @return {HTMLElement}
 */
var getReviewElement = function(data, container) {
  var clonedReview = elementToClone.cloneNode(true);

  /* Number of rating stars */
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

  /* Review text */
  clonedReview.querySelector('.review-text').textContent = data.description;
  container.appendChild(clonedReview);

  /* Review Avatar */
  var reviewImg = new Image();
  var imgLoadTimeout;

  /* При успешной загрузке картинки, удаляется timeout */
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

  /* Показывает фильтры при загрузке списка отзывов */
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

/** @param {function(Array.<Object>)} callback */
var getReviews = function(callback) {
  /* Создаём новый объект XMLHttpReques */
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(null, JSON.parse(xhr.response));
      } else {
        // Response code !== 200
        callback(xhr.statusText, null);
      }
    }
  };

  /* Конфигурируем его: GET-запрос на нужный URL */
  xhr.open('GET', HOTELS_LOAD_URL);

  /* Отправляем запрос */
  xhr.send();
};

/**
 * @param {Array} reviews
 * @param {number} page
 * @param {number} pageSize
 * @return {boolean}
 */
var isNextPageAvailible = function(reviewsArr, page, pageSize) {
  return page < Math.floor(reviewsArr.length / pageSize);
};

var setBtnMoreEnabled = function() {
  moreBtn.addEventListener('click', function() {
    if (isNextPageAvailible(reviews, pageNumber, PAGE_SIZE)) {
      pageNumber++;
      renderReviews(filteredReviews, pageNumber);
    }
  });
};

/**
 * @param {Array.<Object>} reviews
 * @param {number} page
 * @param {boolean=} replace
 */
var renderReviews = function(reviewsTemplate, page, replace) {
  if (replace) {
    reviewsContainer.innerHTML = '';
  }

  var from = page * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  /**
   * @param {HTMLElement}
   */
  reviewsTemplate.slice(from, to).forEach( function(review) {
    getReviewElement(review, reviewsContainer);
    moreBtn.classList.remove('invisible');
  });
};

var getFilteredReviews = function(reviewsList, filter) {
  var reviewsForFilter = reviewsList.slice(0);
  var startDate = new Date();
  var lastTwoWeeks = startDate.setDate(startDate.getDate() - 14);

  switch (filter) {
    case Filter.RECENT:
      reviewsForFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      return reviewsForFilter.filter(function(review) {
        return new Date(review.date) > lastTwoWeeks;
      });
    case Filter.GOOD:
      return reviewsForFilter.filter(function(cReview) {
        return cReview.rating >= 3;
      }).sort(function(a, b) {
        return b.rating - a.rating;
      });
    case Filter.BAD:
      return reviewsForFilter.filter(function(cReview) {
        return cReview.rating <= 2;
      }).sort(function(a, b) {
        return a.rating - b.rating;
      });
    case Filter.POPULAR:
      reviewsForFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }

  return reviewsForFilter;
};

/** @param {string} filter */
var setFilterEnabled = function(filter) {
  filteredReviews = getFilteredReviews(reviews, filter);
  /* сбрасывает номер страницы перед фильтрацией */
  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, true);
};

var setFiltersEnabled = function() {
  reviewsFilter.addEventListener('click', function(evt) {
    if (evt.target.classList.contains('reviews-filter-item')) {
      setFilterEnabled(evt.target.htmlFor);
    }
  });
};

/*
 * Скрывает прелоадер до загрузки списка отзывов
 */
var preloader = document.querySelector('.reviews');
preloader.classList.add('reviews-list-loading');

getReviews(function(err, loadedReviews) {
  preloader.classList.remove('reviews-list-loading');
  if (err) {
    preloader.classList.add('reviews-load-failure');
  } else {
    reviews = loadedReviews;
    setFiltersEnabled();
    renderReviews(getFilteredReviews(reviews, DEFAULT_FILTER), pageNumber);
    setBtnMoreEnabled();
  }
});
