import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { fetchImages } from './js/fetchImages';

// Your API key: 30591553-02722de834b11b67bfed3cccc
// https://pixabay.com/api/

refs.form.addEventListener('submit', onSearchImage);

function onSearchImage(event) {
  event.preventDefault();
  // refs.gallery.innerHTML = "";
  const searchQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();

  fetchImages(searchQuery).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess({ hits }) {
  console.log(hits);
  const markup = createMarkup(hits);
}

function onFetchError(error) {
  console.log('Fetch error:', error.message);
}

// function createMarkup(images) {
//   return images.map(
//     ({
//       webformatURL,
//       largeImageURL,
//       tags,
//       likes,
//       views,
//       comments,
//       downloads,
//     }) => console.log(image)
//   );
// }
