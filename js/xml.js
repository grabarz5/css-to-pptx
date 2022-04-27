export class XML {
    xml = null;

    constructor(str){
        this.parseXML(str);
    }

    parseXML(str){
        this.xml = (new DOMParser()).parseFromString(str, 'text/xml');
    }

    getXml(){
        const shows = [];
        const customShows = this.xml.getElementsByTagName('p:custShowLst')[0].childNodes;

        customShows.forEach( show => {
            shows.push({
                showName: show.getAttribute('name'),
                showId: show.getAttribute('id'),
                // slides: show.childNodes[0].childNodes.
            });
            console.log(Array.from(show.childNodes[0].childNodes).map(sld => sld.getAttribute('r:id')));
        })
        // return this.xml;
    }
}