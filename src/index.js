import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../node_modules/spin.js/spin.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Spinner } from 'spin.js';
import { refs } from './js/refs';
import { getImages } from './js/getImages';
import { createMarkup } from './js/createMarkup';

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

const opts = {
  lines: 7, // The number of lines to draw
  length: 38, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 0.4, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-shrink', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#6262ef', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  zIndex: 2000000000, // The z-index (defaults to 2e9)
  className: 'spinner', // The CSS class to assign to the spinner
  position: 'absolute', // Element positioning
};

const spinner = new Spinner(opts).spin(refs.spinner);

let page;
let searchQuery;

function onSearchImage(event) {
  spinnerStart();
  event.preventDefault();
  clearPage();
  resetPageCounter();
  removeLoadMoreBtn();
  searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  if (!searchQuery) {
    Notify.failure('Please, enter your request and try again.');
    return;
  }

  try {
    onFetchSuccess();
  } catch (error) {
    onFetchError(error);
  }
}

async function onFetchSuccess() {
  const {
    data: { hits, total, totalHits },
  } = await getImages(searchQuery, page);

  if (total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  addMarkup(hits);

  const lightbox = new SimpleLightbox('.gallery a', { scrollZoom: false });

  if (totalHits > 40) {
    addLoadMoreBtn();
  }

  if (totalHits / 40 < page) {
    removeLoadMoreBtn();
    Notify.info("We're sorry, but you've reached the end of search results.");
  }

  if (page === 1) {
    Notify.success(`Hooray! We found ${totalHits} images.`);
  } else {
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2.9,
      behavior: 'smooth',
    });
  }

  spinnerStop();
}

function onFetchError(error) {
  console.log('Fetch error:', error.message);
  spinnerStop();
}

function onLoadMore() {
  spinnerStart();
  page += 1;

  try {
    onFetchSuccess();
  } catch (error) {
    onFetchError(error);
  }
}

function addMarkup(value) {
  const markup = createMarkup(value);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function addLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}

function removeLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function clearPage() {
  refs.gallery.innerHTML = '';
}

function resetPageCounter() {
  page = 1;
}

function spinnerStart() {
  refs.load.classList.remove('is-hidden');
}

function spinnerStop() {
  refs.load.classList.add('is-hidden');
}
