import './jszip.min.js';

export class PPTX {
    exclude = [
        'HeadingPairs', 'TitlesOfParts'
    ];

    jszip; props = {}; source;

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

    parseXML(src){
        return (new DOMParser()).parseFromString(src, 'text/xml');
    }

    setType(val){
        if(val === 'false') return false;
        if(val === 'true') return true;
        return (val === '0') ? 0 : Number(val) || val;
    }
}