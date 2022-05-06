import { PPTX } from './js/pptx.js';

const upload = document.querySelector('#originFile');

window.pptx = new PPTX();

upload.addEventListener('change', async e => {
    await pptx.loadFile(e.target.files[0]);
    const props = await pptx.properties();
    console.log(props);

});