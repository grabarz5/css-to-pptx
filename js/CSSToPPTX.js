import './jszip.min.js';
import { XML } from './xml.js';

export class CSSToPPTX {
    jszip = null;
    source = null;
    xml = null;

    constructor(){
        this.jszip = new JSZip();
    }

    async loadFile(file){
        this.source = await this.jszip.loadAsync(file);
    }

    async getPresentation(){
        return await this.source.folder('ppt').file('presentation.xml').async('string');
    }

    async getCustomSlideShow(){
        return new XML(await this.getPresentation()).getXml();
    }

    generateNewFile(){
        //1. Pobranie listy slajdów z wybranego pokazu niestadardowego
        //2. Usunięcie z wykazu wszystkich slajdów oprócz tych z pkt.1.
        //3. Usunięcie plików slajdów adekwatnie do pkt.2.
        //4. Ewentualne inne czynności modyfikujące.
        //5. Wygenerowanie nowego pliku pptx.
    }
}