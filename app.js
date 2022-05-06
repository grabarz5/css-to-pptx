// import { CSSToPPTX } from './js/CSSToPPTX.js';'./js/CSSToPPTX.js';
import { PPTX } from './js/pptx.js';

const upload = document.querySelector('#originFile');

// window.ctp = new CSSToPPTX();
window.pptx = new PPTX();

upload.addEventListener('change', async e => {
    await pptx.loadFile(e.target.files[0]);
    const props = await pptx.getProperties();
    console.log(props);
    // await ctp.loadFile(e.target.files[0]);
    // await ctp.getCustomSlideShow()
});