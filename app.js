import { CSSToPPTX } from './js/CSSToPPTX.js';'./js/CSSToPPTX.js';

const upload = document.querySelector('#originFile');

window.ctp = new CSSToPPTX();

upload.addEventListener('change', async e => {
    await ctp.loadFile(e.target.files[0]);
    await ctp.getCustomSlideShow()
});