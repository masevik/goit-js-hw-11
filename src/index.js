import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { fetchImages } from './js/fetchImages';
import { createMarkup } from './js/createMarkup';

refs.form.addEventListener('submit', onSearchImage);

function onSearchImage(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  const searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  if (!searchQuery) {
    Notify.failure('Please, enter your request and try again.');
    return;
  }

  fetchImages(searchQuery).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(response) {
  const {
    data: { hits, total, totalHits },
  } = response;

  if (total === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  const markup = createMarkup(hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onFetchError(error) {
  console.log('Fetch error:', error.message);
}
