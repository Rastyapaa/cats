

const btnOpenPopupForm = document.querySelector('#add');
const popupAddCat = new Popup('popup-add-cats')
popupAddCat.setEventListener();
const formAddCat = document.querySelector('#popup-form-cat');
const sectionCard = document.querySelector('.cards');
const formLogin = document.querySelector('#popup-form-login');
const btnLoginOpenPopup = document.querySelector('#loveCats');
const popupLogin = new Popup('popup-login');
popupLogin.setEventListener();
const popupCatInfo = new Popup('popup-cat-info');
popupCatInfo.setEventListener();
const popupImage = new PopupImage('popup-image');
popupImage.setEventListener();

const catsInfoInstance = new CatsInfo('#cats-info-template', handleDeleteCat);
const catsInfoElement = catsInfoInstance.getElement()






function createCat(dataCat) {
    const cardInstance = new Card(dataCat, '#card-template', handleCatImage, handleCatTitle);
    const newCardElement = cardInstance.getElement();
    sectionCard.append(newCardElement);
}


function serializeForm(elements) {// форма для отправки котиков на сервер
    const formData = {};
    elements.forEach(input => {
        if (input.type === 'submit') 
        return
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
    });
    return formData
};

function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats'));
    const getTimeExpires = localStorage.getItem('catsRefrash');
    
    if(localData && localData,length && (new Date() < new Date(getTimeExpires))) {
        localData.forEach(catData => {
            createCat(catData);
            })
    } else {
        api.getAllCats().then((data) => {
            data.forEach(catData => {
                createCat(catData);
            })
            updateLocalStorage(data, {type: 'ALL_CATS'});
        })
    }
}




function handleFormAddCat(e) {
    e.preventDefault()
    const elementsFromCat = [...formAddCat.elements];
    const dataFormCat = serializeForm(elementsFromCat)

    api.addNewCat(dataFormCat).then(() => {
        console.log('dataFormCat',dataFormCat);
        createCat(dataFormCat);
        updateLocalStorage(dataFormCat, {type: 'ADD_CAT'});
    })


   popupAddCat.close();

}

function handleFormLogin(e) {
    e.preventDefault();
    const loginData = [...formLogin.elements];
    const serializeData = serializeForm(loginData);
    Cookies.set('name', `name=${serializeData.name}`);
    btnOpenPopupForm.classList.remove('visually-hidden');
    btnLoginOpenPopup.classList.add('visually-hidden');

    popupLogin.close();
}

function setDataRefrash(minutes, key) {
    const setTime = new Date(new Date().getTime() + minutes * 60000)
    localStorage.setItem(key, setTime);
}

function handleCatImage(dataCat) {
    popupImage.open(dataCat);
}

function handleCatTitle(cardInstance) {
    catsInfoInstance.setData(cardInstance);
    popupCatInfo.setContent(catsInfoElement);
    popupCatInfo.open();
}

function handleDeleteCat(cardInstance) {

    api.deleteCatById(cardInstance.getId()).then(() => {
        cardInstance.deleteView();
        updateLocalStorage(cardInstance.getId(), {type: 'DELETE_CAT'});
        popupCatInfo.close();
    })

   
}

function updateLocalStorage(data, action) {
    const oldStorage = JSON.parse(localStorage.getItem('cats'));

    switch (action.type) {
        case 'ADD_CAT':
            oldStorage.push(data);
            localStorage.setItem('cats', JSON.stringify(data));
            return;
        case 'ALL_CATS':
            localStorage.setItem('cats', JSON.stringify(data));
            setDataRefrash(5, 'catsRefrash');
            return;
        case 'DELETE_CAT':
            console.log('DELETE_CAT', data);
            const newStorage = oldStorage.filter(cat => cat.id !== data);
            localStorage.setItem('cats', JSON.stringify(newStorage));
            return;
        case 'EDIT_CAT':
            const updateStorage = oldStorage.map(cat => cat.id === data.id ? data : cat);
            localStorage.setItem('cats', JSON.stringify(updateStorage));
            return;
        default:
            break;
    }
}

checkLocalStorage();

btnOpenPopupForm.addEventListener('click', () => popupAddCat.open());
btnLoginOpenPopup.addEventListener('click', () => popupLogin.open())
formAddCat.addEventListener('submit', handleFormAddCat)
formLogin.addEventListener('submit', handleFormLogin);
const isAuth = Cookies.get('name');

if (!isAuth) {
    popupLogin.open();
    btnOpenPopupForm.classList.add('visually-hidden');
} else {
    btnLoginOpenPopup.classList.add('visually-hidden');
}