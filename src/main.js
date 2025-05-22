import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.js-form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('.btn-load-more');

let page = 1;
let query = '';
let totalHits = 0;

// Обробка форми
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  query = input.value.trim();
  page = 1;

  if (!query) return;

  showLoader();
  clearGallery();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      iziToast.warning({
        title: 'Oops!',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(data.hits);

    if (page * 15 < totalHits) {
      showLoadMoreButton();
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

// Кнопка "Load more"
loadMoreBtn.addEventListener('click', async () => {
  page++;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(query, page);
    createGallery(data.hits);

    if (page * 15 >= totalHits) {
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

    scrollToNewImages();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Could not fetch more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

// Прокрутка до нових зображень
function scrollToNewImages() {
  const item = document.querySelector('.gallery-item');
  if (!item) return;

  const { height: cardHeight } = item.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}