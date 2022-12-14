import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '../node_modules/spin.js/spin.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { opts } from './js/spinnerOptions';
import { Spinner } from 'spin.js';
import { refs } from './js/refs';
import { getImages } from './js/getImages';
import { createMarkup } from './js/createMarkup';

const lightbox = new SimpleLightbox('.gallery a', { scrollZoom: false });
const spinner = new Spinner(opts).spin(refs.spinner);
const per_page = 40;
let page = 0;
let searchQuery = '';

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearchImage(event) {
  event.preventDefault();
  spinnerStart();
  clearPage();
  resetPageCounter();
  removeLoadMoreBtn();
  searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  if (!searchQuery) {
    Notify.failure('Please, enter your request and try again.');
    spinnerStop();
    return;
  }

  onFetch();
}

async function onFetch() {
  try {
    const {
      data: { hits, total, totalHits },
    } = await getImages(searchQuery, page, per_page);

    if (total === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    addMarkup(hits);
    lightbox.refresh();
    removeLoadMoreBtn(totalHits);
    addLoadMoreBtn(hits);

    if (page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    } else {
      smoothScroll();
    }
  } catch (error) {
    console.log('Fetch error:', error.message);
  } finally {
    spinnerStop();
  }
}

function onLoadMore() {
  spinnerStart();
  page += 1;

  onFetch();
}

function addMarkup(value) {
  const markup = createMarkup(value);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function addLoadMoreBtn(hits) {
  if (hits.length === per_page) {
    refs.loadMoreBtn.classList.remove('is-hidden');
  }
}

function removeLoadMoreBtn(totalHits) {
  refs.loadMoreBtn.classList.add('is-hidden');
  if (totalHits / per_page < page) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function clearPage() {
  refs.gallery.innerHTML = '';
}

function resetPageCounter() {
  page = 1;
}

function spinnerStart() {
  spinner.spin(refs.spinner);
  refs.load.classList.remove('is-hidden');
}

function spinnerStop() {
  refs.load.classList.add('is-hidden');
  spinner.stop(refs.spinner);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2.9,
    behavior: 'smooth',
  });
}
