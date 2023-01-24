const btnOpenPopupForm = document.querySelector('#add');
const popupAddCat = new Popup('popup-add-cats')
const formAddCat = document.querySelector('#popup-form-cat');
const sectionCard = document.querySelector('.cards');


cats.forEach(catData => {
const cat = new Card(catData, '#card-template');
const firstCat = cat.getElement();
sectionCard.append(firstCat);
})

popupAddCat.setEventListener();
btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());

function handleFormAddCat(e) {
    e.preventDefault()
   popupAddCat.close

}
formAddCat.addEventListener('submit', handleFormAddCat)