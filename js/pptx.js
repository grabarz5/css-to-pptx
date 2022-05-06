import './jszip.min.js';

export class PPTX {
    exclude = [ 'HeadingPairs', 'TitlesOfParts' ];
    jszip = null;
    pres = {};
    props = {};
    source = null;

    constructor() {
        if(typeof JSZip === 'undefined'){
            throw new Error('JSZip not imported');
        }

        this.jszip = new JSZip();
        
        return this;
    }

    async loadFile(file) {
        this.source = await this.jszip.loadAsync(file);
    }

    async properties(...props){
        const _docProps = await this.source.folder('docProps').file('app.xml').async('string');
        const _docPropsCore = await this.source.folder('docProps').file('core.xml').async('string');

        const docPropsXML = this.parseXML(_docProps).querySelector('Properties');
        const docPropsCoreXML = this.parseXML(_docPropsCore).getElementsByTagName('cp:coreProperties')[0];

        docPropsXML.childNodes.forEach(node => {
            if(!this.exclude.includes(node.tagName)){
                if(!props.length || props.includes(node.tagName)){
                    this.props[node.tagName] = this.setType(node.textContent);
                }
            }
        });

        docPropsCoreXML.childNodes.forEach(node => {
            const key = node.tagName.split(':')[1];
            this.props[key.charAt(0).toUpperCase() + key.slice(1)] = this.setType(node.textContent);
        });

        return this.props;
    }

    async presentation(){
        const _presentation = await this.source.folder('ppt').file('presentation.xml').async('string');
        const presentationXML = this.parseXML(_presentation).getElementsByTagName('p:presentation')[0];

        const sldMasterId = presentationXML.getElementsByTagName('p:sldMasterIdLst')[0].childNodes[0];
        const sldIdLst = presentationXML.getElementsByTagName('p:sldIdLst')[0];

        ///SLIDES LIST

        this.pres.slides = [{
            type: 'master',
            id: sldMasterId.getAttribute('id'),
            rid: sldMasterId.getAttribute('r:id'),
        }];

        sldIdLst.childNodes.forEach(node => {
            this.pres.slides.push({
                type: 'simple',
                id: node.getAttribute('id'),
                rid: node.getAttribute('r:id'),
            });
        });

        ///CUSTOM SHOWS LIST

        this.pres.customShows = [];
        const custShowLst = presentationXML.getElementsByTagName('p:custShowLst')[0];

        custShowLst.childNodes.forEach(show => {
            this.pres.customShows.push({
                showName: show.getAttribute('name'),
                id: show.getAttribute('id'),
                slides: Array.from(show.getElementsByTagName('p:sldLst')[0].childNodes)
                    .map(node => node.getAttribute('r:id'))
            });
        });
        
        return this;
    }

    getSlides(){
        return this.pres.slides;
    }

    getCustomShows(){
        return this.pres.customShows;
    }

    parseXML(src){
        return (new DOMParser()).parseFromString(src, 'text/xml');
    }

    setType(val){
        if(val === 'false') return false;
        if(val === 'true') return true;
        return (val === '0') ? 0 : Number(val) || val;
    }
}