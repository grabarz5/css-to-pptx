import './jszip.min.js';

export class PPTX {
    exclude = [
        'HeadingPairs', 'TitlesOfParts'
    ];

    jszip; properties = {}; source;

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

    async getProperties(...props){
        const _docProps = await this.source.folder('docProps').file('app.xml').async('string');
        const docPropsXML = this.parseXML(_docProps).querySelector('Properties');

        docPropsXML.childNodes.forEach(node => {
            if(!this.exclude.includes(node.tagName)){
                if(!props.length || props.includes(node.tagName)){
                    this.properties[node.tagName] = this.setType(node.textContent);
                }
            }
        });

        return this.properties;
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