// import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

// export default defineNuxtPlugin(nuxtApp => {
//     nuxtApp.provide('bootstrap', { ...bootstrap });
import * as bootstrap from 'bootstrap';
const { Modal, Collapse } = bootstrap;

export default defineNuxtPlugin(_nuxtApp => {
  return {
    provide: {
      bootstrap: {
        modal: element => new Modal(element),
        collapse: element => new Collapse(element)
      }
    }
  };
});