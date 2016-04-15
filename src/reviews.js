'use strict';

var reviewsFilter = document.querySelector('.reviews-filter');

var templateElement = document.querySelector('#review-template');
var reviewsContainer = document.querySelector('.reviews-list');
var elementToClone;
/** @constant {number} */
var IMG_LOAD_TIMEOUT = 10000;
/** @constant {string} */
var HOTELS_LOAD_URL = '//o0.github.io/assets/json/reviews.json';

var reviews = [];

var Filter = {
  'ALL': 'reviews-all',
  'RECENT': 'reviews-recent',
  'GOOD': 'reviews-good',
  'BAD': 'reviews-bad',
  'POPULAR': 'reviews-popular'
};

/** @constant {Filter} */
var DEFAULT_FILTER = Filter.ALL;

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
 * @param {Array.<Object>}
 * принимает на вход параметр reviews,
 * который представляет собой абстрактный массив отелей любого вида.
 */
var renderReviews = function(reviews1) {
  reviewsContainer.innerHTML = '';

  /**
   * @param {HTMLElement}
   */
  reviews1.forEach( function(review) {
    getReviewElement(review, reviewsContainer);
  });
};

var getFilteredReviews = function(reviews1, filter) {
  var reviewsForFilter = reviews1.slice(0);

  switch (filter) {
    case Filter.RECENT:
      reviewsForFilter.sort(function(a, b) {
        console.log(a.recent, b.recent);
        return a.recent - b.recent;
      });
      break;
    case Filter.GOOD:
      // reviewsForFilter.sort(function(a, b) {
      //   console.log(a.rating, b.rating);
      //   return a.rating - b.rating;
      // });
      reviewsForFilter = reviews;
      console.log('GOOD');
      break;
    case Filter.BAD:
      // reviewsForFilter.sort(function(a, b) {
      //   return b.rating - a.rating;
      // });
      reviewsForFilter = reviews;
      break;
    case Filter.POPULAR:
      reviewsForFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
    // default:
    //   reviewsForFilter = reviews;
    //   break;
  }

  return reviewsForFilter;
};

/** @param {string} filter */
var setFilterEnabled = function(filter) {
  // debugger;
  var filteredReviews = getFilteredReviews(reviews, filter);
  renderReviews(filteredReviews);
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
    setFiltersEnabled();
    // renderReviews(loadedReviews);
    renderReviews(getFilteredReviews(loadedReviews, DEFAULT_FILTER));
  }
});
