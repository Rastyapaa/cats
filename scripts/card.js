class Card {
    constructor(dataCat, selectorTemplate) {
        this.dataCat = dataCat;
        this.selectorTemplate = selectorTemplate;
        }


_getTemplate() {
    return document.querySelector(this.selectorTemplate).content.querySelector('.card');
}

getElement() {
    this.element = this._getTemplate().cloneNode(true);
    this.cardTitle = this.element.querySelector('.card__name');
    this.cardImage = this.element.querySelector('.card__image');
    this.cardLike = this.element.querySelector('.card__like');

    this.cardTitle.textContent = this.dataCat.name;
    this.cardImage.src = this.dataCat.img_link;

    if(this.dataCat.favourite){
        this.cardLike.classList.toggle('card__like_active')
    } 
    else this.cardLike.remove('card__like_active')

    return this.element
}

// setElement() {

// }

}
// const cat = new Card(cats[0], '#card-template')
// cat.getElement()