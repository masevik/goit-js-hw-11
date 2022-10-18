import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { getImages } from './js/getImages';
import { createMarkup } from './js/createMarkup';

refs.form.addEventListener('submit', onSearchImage);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

let page;
let searchQuery;

function onSearchImage(event) {
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

  getImages(searchQuery, page).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(response) {
  const {
    data: { hits, total, totalHits },
  } = response;
  const lightbox = new SimpleLightbox('.gallery a');

  if (total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  addMarkup(hits);

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
}

function onFetchError(error) {
  console.log('Fetch error:', error.message);
}

function onLoadMore() {
  page += 1;

  getImages(searchQuery, page).then(onFetchSuccess).catch(onFetchError);
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
