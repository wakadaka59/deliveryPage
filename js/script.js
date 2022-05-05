// глобальные переменные
const phoneFields = document.querySelectorAll('#phone');

let cardNumberGlobal;
let dateValueGlobal;
let deliveryAdressGlobal;
let deliveryAdressField = document.querySelector('#delivery-address');

let cardFields;
let cardNumberDiv;

let now = new Date();
let nowYear = now.getFullYear();
let dateField = document.querySelector('[type="date"]');

// document.querySelector('#pick-up-goj').checked = true;

let pickupButton = document.querySelector('.tab[data-tab="pickup"]');
let deliveryButton = document.querySelector('.tab[data-tab="delivery"]');
//---------------------------Выбор между самовывозом и доставкой-----------------------------
( function() {    

    //трансфер номера телефона сделан не прямой, а через localStorage просто потому, что так захотелось.
    function transferPhoneValues() {
        phoneFields.forEach(field => {
            field.value = localStorage.getItem('phone');
        });
    }

    //прямой трансфер номера карты из доставки в самовывоз
    function transferCardNumberToDelivery() {
        document.querySelector('#deliver-crd-1').value = document.querySelector('#card-fields-1').value;
        document.querySelector('#deliver-crd-2').value = document.querySelector('#card-fields-2').value;
        document.querySelector('#deliver-crd-3').value = document.querySelector('#card-fields-3').value;
        document.querySelector('#deliver-crd-4').value = document.querySelector('#card-fields-4').value;
    }
    //прямой трансфер номера карты из самовывоза в доставку
    function transferCardNumberToPickup() {
        document.querySelector('#card-fields-1').value = document.querySelector('#deliver-crd-1').value;
        document.querySelector('#card-fields-2').value = document.querySelector('#deliver-crd-2').value;
        document.querySelector('#card-fields-3').value = document.querySelector('#deliver-crd-3').value;
        document.querySelector('#card-fields-4').value = document.querySelector('#deliver-crd-4').value;
    }
    //
    function transferRadioButtons() {
        if (!pickupButton.classList.contains("active")) {
            let chosenCity = document.querySelector('#pickup-cities input[name="city"]:checked').value;
            // console.log(`В самовывозе был выбран город ${chosenCity}`);
            document.querySelector(`#delivery-cities input[value='${chosenCity}']`).checked = true;
        }
        if (!deliveryButton.classList.contains("active")) {
            let chosenCity = document.querySelector('#delivery-cities input[name="city"]:checked').value;
            // console.log(`В доставке был выбран город ${chosenCity}`);
            document.querySelector(`#pickup-cities input[value='${chosenCity}']`).checked = true;
        }
        if (!pickupButton.classList.contains("active")) {
            let paymentMethod = document.querySelector('input[name="pickup-payment-method"]:checked').value;            
            // console.log(`В самовывозе был выбран метод оплаты ${paymentMethod}`);
            document.querySelector(`#deliveryForm input[value='${paymentMethod}']`).checked = true;
        }
        if (!deliveryButton.classList.contains("active")) {
            let paymentMethod = document.querySelector('input[name="delivery-payment-method"]:checked').value;
            // console.log(`В доставке был выбран метод оплаты ${paymentMethod}`);
            document.querySelector(`#pickupForm input[value='${paymentMethod}']`).checked = true;
        }
    }

    function showPickupFunctional() {
        cardFields = document.querySelectorAll('#pickup-input-card-number input');
        cardNumberDiv = document.querySelector('#pickup-input-card-number');
        deliveryButton.classList.remove('active');
        pickupButton.classList.add('active');
        document.querySelector('.tabs-block__pick-up').hidden = false;
        document.querySelector('.tabs-block__item-delivery').hidden = true;
        
        transferRadioButtons();
        transferPhoneValues();
        transferCardNumberToPickup();
        activateCardFields();
        cardNumberGlobal = getCardNumber();
        validateCardNumber(cardNumberGlobal);
    }
    function showDeliveryFunctional() {
        cardFields = document.querySelectorAll('#delivery-input-card-number input');
        cardNumberDiv = document.querySelector('#delivery-input-card-number');
        pickupButton.classList.remove('active');
        deliveryButton.classList.add('active');
        document.querySelector('.tabs-block__item-delivery').hidden = false;
        document.querySelector('.tabs-block__pick-up').hidden = true;
        
        transferRadioButtons();
        transferPhoneValues();
        transferCardNumberToDelivery();
        activateCardFields();

        deliveryAdressGlobal = document.querySelector('#delivery-address').value;
        validateDeliveryAdress(deliveryAdressGlobal);

        cardNumberGlobal = getCardNumber();
        validateCardNumber(cardNumberGlobal);

        validateDate();        
    }
    showDeliveryFunctional();
    // showPickupFunctional(); // функционал самовывоза включён по-умолчанию
    pickupButton.onclick = showPickupFunctional; // вкл. функционал самовывоза
    // pickupButton.onclick = transferRadioButtons;
    deliveryButton.onclick = showDeliveryFunctional; // вкл. функционал доставки
}() ); // самовызывающаяся анонимная ф-я


//---------------------------Переключение типа оплаты----------------------------------------------
( function() {
    const pickupCardButton = document.querySelector('#pickup-payment-card'),
    pickupCashButton = document.querySelector('#pickup-payment-cash'),
    pickupCardNumberDiv = document.querySelector('#pickup-input-card-number'),
    
    deliveryCardButton = document.querySelector('#delivery-payment-card'),
        deliveryCashButton = document.querySelector('#delivery-payment-cash'),
        deliveryCardNumberDiv = document.querySelector('#delivery-input-card-number');        
        
        let payPickupWithCash = function() {        
        pickupCardNumberDiv.style.cssText = "display: none";
    };
    let payPickupWithCard = function() {
        pickupCardNumberDiv.style.cssText = "display: flex";
    };
    let payDeliveryWithCash = function() {        
        deliveryCardNumberDiv.style.cssText = "display: none";
    };
    let payDeliveryWithCard = function() {
        deliveryCardNumberDiv.style.cssText = "display: flex";
    };
    
    pickupCardButton.onclick = payPickupWithCard;
    pickupCashButton.onclick = payPickupWithCash;
    deliveryCardButton.onclick = payDeliveryWithCard;
    deliveryCashButton.onclick = payDeliveryWithCash;
    // pickupCardButtons.forEach(button => {
    //     button.onclick = payPickupWithCard;
    // });
    
    // pickupCashButtons.forEach(button => {
        //     button.onclick = payPickupWithCash;
    // });
    
    // cashButton.onclick = payWithCash;
    // cardButton.onclick = payWithCard;
}() );

//---------------------------Номер банковской карты ----------------------------------------------
// главный узел обработки номера карты, запускает всё
function activateCardFields() {
    cardFields.forEach(function(field, i) {
        field.addEventListener('input', (e) => {
            // localStorage.setItem(`card${i+1}`, field.value); // кладём в локхран значение каждого поля карты    
            if (e.target.value.length == 4) {
                goToNextField(e.target.id);    
            }
            let cardNumber = getCardNumber();            
            validateCardNumber(cardNumber);
        });
    });
    
    // функционал бэкспейса на полях с кусками номера карты
    cardFields.forEach(field => {    
        field.addEventListener('keydown', (e) => {
            if (e.code == 'Backspace') {            
                if (e.target.value.length == 0) {
                    goToPrevField(e.target.id);
                }
            }
        });
    });
}

// получает следующее поле и ставит на нём фокус
function goToNextField(currentField) {
    let k = +currentField.slice(12);
    let i = +currentField.slice(12) + 1;
    if (i < 5) {
        let nextFieldID = currentField.replace(k, i);    
        let nextField = document.querySelector(`#${nextFieldID}`);
        nextField.focus();
    }
}

// получает предыдущее поле и ставит на нём фокус
function goToPrevField(currentField) {
    let k = +currentField.slice(12);
    let i = +currentField.slice(12) - 1;
    if (i > 0) {
        let prevBlockID = currentField.replace(k, i);    
        let prevBlock = document.querySelector(`#${prevBlockID}`);
        prevBlock.focus();
        prevBlock.selectionStart = prevBlock.value.length;
    }
}

// собирает из четырёх полей карты один номер карты в виде строки
function getCardNumber() {
    let cardNumber = '';
    cardFields.forEach(field => {
        cardNumber += field.value; 
    });
    return cardNumber;
}

//проверка номера карты, внутри запускает функцию с алгоритмом Луна
function validateCardNumber(cardNumber) {
    if (cardNumber.length < 16) {
        cardNumberDiv.classList.add("input-wrapper--error");
        cardNumberDiv.classList.remove("input-wrapper--success");
    } else {
        if (!luhnAlgorythm(cardNumber)){
            // console.log(`Номер не валиден.`);
            
            cardNumberDiv.classList.remove("input-wrapper--success");
            cardNumberDiv.classList.add("input-wrapper--error");
        }
        if (luhnAlgorythm(cardNumber)) {
            // console.log(`Проверка пройдена`);
            
            cardNumberDiv.classList.remove("input-wrapper--error");
            cardNumberDiv.classList.add("input-wrapper--success");
            
        } 
    }
}

// алгоритм Луна, возвращает true\false
function luhnAlgorythm(value) {
    if (!value) {
        return false;
    }
    // accept only digits, dashes or spaces
        if (/[^0-9-\s]+/.test(value)) {
            return false;
        }
        
        // The Luhn Algorithm. It so pretty.
        var nCheck = 0, nDigit = 0, bEven = false;
        value = value.replace(/\D/g, "");
        
        for (var n = value.length - 1; n >= 0; n--) {
            var cDigit = value.charAt(n);        
            nDigit = parseInt(cDigit, 10);

            if (bEven) {
                if ((nDigit *= 2) > 9) {
                    nDigit -= 9;
            }
        }

        nCheck += nDigit;
        bEven = !bEven;
    }
    return (nCheck % 10) == 0;
}

// --------------------------------- Номера телефонов ------------------------------------------
const phoneForms = document.querySelectorAll('#phone-form');

phoneFields.forEach(field => {
    field.addEventListener('input', (e) => {
        if (field.value == "") {
            field.value = "+7";
        }
        
        localStorage.setItem('phone', e.target.value); // сохраняем инпут в лок. хранилище
        
        if (field.value.length >= 12) {
            if (validatePhone(e.target.value)) {
                phoneForms.forEach(form => {
                    form.classList.remove("input-wrapper--error");
                    form.classList.add("input-wrapper--success");
                });
            } else {
                phoneForms.forEach(form => {
                    form.classList.remove("input-wrapper--success");
                    form.classList.add("input-wrapper--error");
            });
        }
    } else {
        phoneForms.forEach(form => {
                form.classList.remove("input-wrapper--success");
            });
        }
    });
    field.addEventListener('focus', (e) => {
        if (field.value == "") {
            field.value = "+7";
        }
    });  
});

// валидация номера телефона
function validatePhone(value) {
    let result = value.match(/\+\d{11}\b/);
    if (result) {
        return true;
    } else {
        return false;
    }
}

// ------------------------- Доставка: дата доставки -------------------------------------
dateField.onchange = validateDate;

function validateDate() {
    let dateValue = dateField.value;
    if (dateCheck(dateValue)) {
        dateField.parentElement.classList.remove("input-wrapper--error");
        dateField.parentElement.classList.add("input-wrapper--success");
    } else {
        dateField.parentElement.classList.remove("input-wrapper--success");
        dateField.parentElement.classList.add("input-wrapper--error");
    }    
}

// проверка на корректность формата даты
function dateCheck(dateValue) {
    if (dateValue.match(/^\d{4}[./-]\d{2}[./-]\d{2}$/)) {
        let day = +dateValue.slice(8);
        let month = +dateValue.slice(5, 7);
        let year = +dateValue.slice(0, 4);
        if (day >= 1 && day <= 31 && month >= 1 && month <= 12 && (year === nowYear || year === nowYear + 1)) {
            return dateBusinessConditionsCheck(dateValue);
        } 
        else {
            return false;
        }
    }
}

// дополнительная проверка на бизнес-условия
function dateBusinessConditionsCheck(dateValue) {    
    let x = new Date(dateValue);
    x.setHours(0, 0, 0, 0);

    let nowPlusOneDay = new Date();
    nowPlusOneDay.setDate(nowPlusOneDay.getDate() + 1);
    nowPlusOneDay.setHours(0, 0, 0, 0);

    let nowPlusSevenDays = new Date();
    nowPlusSevenDays.setDate(nowPlusSevenDays.getDate() + 7);
    nowPlusSevenDays.setHours(0, 0, 0, 0);

    if (x >= nowPlusOneDay && x <= nowPlusSevenDays) {
        return true;
    } else {
        return false;
    }
}

//--------------------------------Доставка: ввод адреса доставки---------------------
// установка статусов на поле
function validateDeliveryAdress (deliveryAdress) {
    if (deliveryAdress.length > 0) {
        deliveryAdressField.parentElement.classList.remove("input-wrapper--error");
        deliveryAdressField.parentElement.classList.add("input-wrapper--success");
    } else {
        deliveryAdressField.parentElement.classList.remove("input-wrapper--success");
        deliveryAdressField.parentElement.classList.add("input-wrapper--error");
    }
}
// обработчик событий на ввод
deliveryAdressField.addEventListener('input', (e) => {
    let deliveryAdress = deliveryAdressField.value;
    validateDeliveryAdress(deliveryAdress);
});

//--------------------------------Доставка: ползунок времени доставки---------------------
let thumb = document.querySelector('.js_range-slider-thumb');
let area = document.querySelector('.js_range-slider-thumb-area');
let leftEdge = document.querySelector('.js_range-slider-thumb-area').getBoundingClientRect().left;
const thumbTooltip = document.querySelector('.range-slider-tooltip');
// всего шагов будет 21, так как шаг по бизнес-условиям у нас равен 20 минутам,
// в часе три шага, в диапазоне времени доставки семь часов. 3*7=21.
let step = 0;
let minutes;
// массивы с номерами шагов, соотв. 20 и 40 минутам.
const arr20mins = [1, 4, 7, 10, 13, 16, 19];
const arr40mins = [2, 5, 8, 11, 14, 17, 20];
// итоговая интересующая нас переменная со временем доставки, уходит на сервер.
let delTime = '10:00 - 12:00';

thumb.onmousedown = function (e) {
    thumb.ondragstart = function() {
        return false;
    };    
    let thumbLeft = thumb.getBoundingClientRect().left;
    // Переопределение StepPx сделал потому, что пользователь может изменить
    // масштаб страницы и тогда изменятся все пиксельные размеры, что грозит
    // поломкой функционала.
    let stepPx = Math.round(area.offsetWidth / 21);
    let shiftX = e.pageX - thumbLeft;

    document.onmousemove = function(e) {
        // формула считает новое левое положение бегунка
        let newLeft = e.pageX - leftEdge - shiftX;
        // console.log(`newLeft = ${newLeft}`);
        // если новое положение бегунка преодолело барьер шага,
        // значит номер шага надо изменить на новый 
        if ( Math.floor(newLeft / stepPx) !== step ) {
            // определяем номер шага от 1 до 21
            step = Math.floor(newLeft / stepPx);
            // устанавливаем границы для бегунка
            if (step > 21) {step = 21;}
            if (step < 0) {step = 0;}
            moveThumb(stepPx);
        }
        // при поднятии кнопки мыши убираем обработчики
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };    
};

document.addEventListener('keydown', (e) => {
    let stepPx = Math.round(area.offsetWidth / 21);
    if (e.shiftKey && e.code == 'ArrowRight') {
        step += 1;
        moveThumb(stepPx);
    }
    if (e.shiftKey && e.code == 'ArrowLeft') {
        step -= 1;
        moveThumb(stepPx);
    }
});

function moveThumb(stepPx) {
    if (step > 21) {step = 21;}
    else if (step < 0) {step = 0;}
    // определяем минуты исходя из номера шага
    if (step % 3 === 0) {minutes = '00';}
    else if (arr20mins.includes(step)) {minutes = '20';}
    else if (arr40mins.includes(step)) {minutes = '40';}
    // определяем часы
    let hours = Math.floor(step * 20 / 60);
    // склеиваем итоговое время доставки
    delTime = (10 + hours) + ':' + minutes + ' - ' + (12 + hours) + ':' + minutes;
    // вносим изменения в подсказку над бегунком
    thumbTooltip.textContent = `${delTime}`;
    // двигаем бегунок на цену одного шага в пикселях
    thumb.style.left = step * stepPx + 'px';
}


//----------------------------Вкл кнопку "заказать" и проверка заполненности полей ---------------------
(function () {
    const delForm = document.querySelector('#deliveryForm'),
        delFields = document.querySelectorAll('#delivery-address-field, #delivery-date-field, #delivery-input-card-number, #delivery-phone-field'),
        delOrderBtn = document.querySelector('#deliveryForm .form__submit-btn'),
        delOrderHint = document.querySelector('#del-hint'),
        pickForm = document.querySelector('#pickupForm'),
        pickFields = document.querySelectorAll('#pickup-input-card-number', '#pickup-phone-field'),
        pickOrderBtn = document.querySelector('#pickupForm .form__submit-btn'),
        pickOrderHint = document.querySelector('#pick-hint');
    let unfilled = [];    
    // let unfilled = ['Адрес', 'Дата доставки', 'Номер карты'];

    delForm.oninput = function () {
        // console.log('В одном из полей произошло изменение');
        let orderBtn = delOrderBtn;
        let inputFields = delFields;
        let orderHint = delOrderHint;
        lookForUnfilled(inputFields, orderBtn, orderHint);
    };

    pickForm.oninput = function() {
        let orderBtn = pickOrderBtn;
        let inputFields = pickFields;
        let orderHint = pickOrderHint;
        lookForUnfilled(inputFields, orderBtn, orderHint);
    };

    function lookForUnfilled(inputFields, orderBtn, orderHint) {
        // status = true если все поля зелёные. false, если поля красные\серые.
        let status = true;
        inputFields.forEach(function(field) {
            let fieldName = field.children[0].textContent;
            // ищем незаполненные поля, либо содержащие ошибку
            if (!field.classList.contains('input-wrapper--success')) {
                status = false;
                orderBtn.disabled = true;
                // незаполненные поля добавляем в массив (если их ещё там нет)
                if (!unfilled.includes(fieldName)) {unfilled.push(fieldName);}
                console.log(`unfilled сейчас содержит ${unfilled}`);
            }
            // если же поле позеленело, то ...
            else if (field.classList.contains('input-wrapper--success')) {
                // ...удаляем из массива незаполненных имя того поля
                if (unfilled.includes(fieldName)) {unfilled.splice(unfilled.indexOf(fieldName), 1);}
                // ...и проверяем, осталось ли в массиве хоть что-то. если массив пустой, status = true.
                if (unfilled == []) {status = true;}
            }
        });

        // в зависимости от статуса вкл\откл кнопка "ЗАКАЗАТЬ"
        if (status === true) {orderBtn.disabled = false;}
        if (status === false) {orderBtn.disabled = true;}

        // ОБРАБОТКА МАССИВА НЕЗАПОЛНЕННЫХ ПОЛЕЙ
        // оборачиваем каждый элемент массива в спан
        for (let i = 0; i < unfilled.length; ++i) {
            unfilled[i] = `<span>${unfilled[i]}</span>`;
        }
        // склеиваем массив в одну строку, добавляем запятые-разделители, понижаем регистр букв
        let message = unfilled.reduce((msg, piece) => `${msg.toLowerCase()}, ${piece.toLowerCase()}`);        
        // заменяем последнюю запятую на " и"
        let x = message.lastIndexOf(',');
        message = message.substring(0, x) + ' и' + message.substring(x + 1);
        // добавляем готовое сообщение на страницу
        orderHint.innerHTML = message;
        // очищаем массив незаполненных
        unfilled = [];
    }

} ());

    // function checkFieldsStatus() {
    //     if (deliveryButton.classList.contains("active")) {
    //         let orderBtn = delOrderBtn;
    //         let inputFields = delFields;
    //         lookForUnfilled(inputFields, orderBtn);
    //     }
    //     else if (pickupButton.classList.contains("active")) {
    //         let orderBtn = pickOrderBtn;
    //         let inputFields = pickFields;
    //         lookForUnfilled(inputFields, orderBtn);
    //     }        
    // }

// function checkFieldsStatus() {
//     let status = true;
//     if (deliveryButton.classList.contains("active")) {
//         let orderBtn = delOrderBtn;
//         delFields.forEach(function(field) {
//             let fieldName = field.children[0].textContent;
//             // ищем незаполненные поля, либо содержащие ошибку
//             if (!field.classList.contains('input-wrapper--success')) {
//                 status = false;
//                 orderBtn.disabled = true;
//                 if (!unfilled.includes(fieldName)) {unfilled.push(fieldName);}
//             }
//             else if (field.classList.contains('input-wrapper--success')) {
//                 // удаляем из массива имя незаполненного поля
//                 unfilled.splice(unfilled.indexOf(fieldName), 1);
//                 if (unfilled == []) {status = true;}
//             }
//         });
//         if (status === true) {orderBtn.disabled = false;}
//         if (status === false) {orderBtn.disabled = true;}
//     }
//     else if (pickupButton.classList.contains("active")) {
        
//     }
    
// }

// delAddress = document.querySelector('#delivery-address-field'),
// delDate = document.querySelector('#delivery-date-field'),
// delCard = document.querySelector('#delivery-input-card-number'),
// delPhone = document.querySelector('#delivery-phone-field'),
// pickCard = document.querySelector('#pickup-input-card-number'),
// pickPhone = document.querySelector('#pickup-phone-field'),



// Предыдущий вариант без чекпоинтов, с попиксельным сдвигом, вставлять внутрь маусмува
// if (newLeft < 0) newLeft = 0;
// rightEdge это ширина доступной ползунку зоны движения
// if (newLeft > rightEdge) newLeft = rightEdge;        
// thumb.style.left = newLeft + 'px';

// function handleMouseClick(event) {
//     console.log('Вы нажали на элемент:', event.target);
// }  
//   // Добавляем обработчик события
//   window.addEventListener('click', handleMouseClick);
  
  // Убираем обработчик события
//   window.removeEventListener('click', handleMouseClick);

// рабочие варианты как двигать ползунок:
// thumb.style.transform = `translateX(${left + "px"})`;
// thumb.style.left = left + 23 + 'px';


// //---------------------------Самовывоз: Города и карта----------------------------------------------
// (function () {
//     let displayedMap = document.querySelector('#map2gis');
//     let inputs = document.querySelectorAll('input');
//     let pickupCityNames = document.querySelectorAll('.pickup-city-name');
//     let citiesObject;
//     let deliveryPoints;
//     let cityID;
//     let ledDeliveryPoints;

//     // Показывает сразу все точки самовывоза на карте
//     let showPickupPointsOnMap = function() {    
//         let array = []; // создаём пустой массив для координат
//         deliveryPoints.forEach(object => { // записываем в него координаты всех точек доставки
//             array.push(object['coordinates']); // получается массив с массивами
//         });
//         // console.log(array);
//         DG.then(function() { // DG.then - специальный объект АПИ 2ГИС, все методы для карты работают ТОЛЬКО в нём
//             let allCityMarkers = DG.featureGroup(); // объявляем переменную для группы маркеров
//             allCityMarkers.removeFrom(map); // удаляем с карты все ранее созданные маркеры
//             array.forEach(coordinates => { // разбираем массив с координатами
//                 DG.marker([coordinates[0], coordinates[1]]).addTo(allCityMarkers);
//             });
//             allCityMarkers.addTo(map); // добавляем все маркеры на карту
//             map.fitBounds(allCityMarkers.getBounds()); // умещаем все точки на карте сразу
//             map.zoomOut(1); // уменьшаем масштаб эквивалентно 1 нажатию кнопки "минус"
//         });
//     };

//     // Управляет передвижением карты по клику мыши на точку доставки
//     let moveToPoint = function() {
//         let pickupPointsButtons = document.querySelectorAll('#pickupAdresses input');
//         for (let i of pickupPointsButtons) { // навешиваем передвижение карты на каждую созданную кнопку с адресом
//             i.addEventListener('click', (event) => {                             
//                 let coordinates = deliveryPoints.find(item => item.address == event.target.value).coordinates;
//                 // console.log(coordinates);
//                 DG.then(function() {
//                     map.panTo([coordinates[0], coordinates[1]]); // передвигает карту к конкретному адресу
//                     map.setZoomAround([coordinates[0], coordinates[1]], 15); // устанавливает зум размера 15 на конкретный адрес
//                 });
//             }); 
//         }
//     };

//     // Создаёт кнопки с адресами по клику на город
//     let createPickupPoints = function (cityID) {
//         let pickupAdressesBlock = document.querySelector('#pickupAdresses');
//         pickupAdressesBlock.innerHTML = '<h4>Адрес пункта выдачи заказов</h4>';        
//         deliveryPoints = citiesObject.cities.find(item => item["city-id"] == cityID)["delivery-points"];        
//         // console.log(deliveryPoints);
//         for (let i = 0; i < deliveryPoints.length; ++i) {                   
//             pickupAdressesBlock.insertAdjacentHTML('beforeend', `
//             <input id="pick-up-led-address-${i+1}" type="radio" name="led-address" value="${deliveryPoints[i].address}"/>
//             <label for="pick-up-led-address-${i+1}" >${deliveryPoints[i].address}</label>
//             `);
//         }
//         showPickupPointsOnMap();
//         moveToPoint();  
//     };

//     // Отключаем все кнопки на время загрузки данных по городам
//     // Тут можно сделать что угодно: например, повесить сообщение для пользователя "Загрузка"
//     // Или покрасить кнопки в серый на время загрузки
//     inputs.forEach(input => {
//         input.disabled = true;
//     });

//     // Фетч-запрос получает данные по городам и записывает их в глобальный citiesObject
//     let getCitiesData = async (url) => {
//         let citiesData = await fetch(url);
//         if (!citiesData.ok) { // этот иф отлавливает ошибки статуса по HTTP (т.к. сам фетч не считает их за ошибки)
//             throw new Error(`Не могу принести ${url}, статус: ${citiesData.status}`);
//         }    
//         citiesObject = await citiesData.json();
//         ledDeliveryPoints = citiesObject.cities.find(item => item["city-id"] == "led")["delivery-points"];
//         // console.log(ledDeliveryPoints); 
//         // включаем все кнопки после загрузки данных по городам
//         inputs.forEach(input => {
//             input.disabled = false;
//         });
//         // console.log(citiesObject);
//         document.querySelector('#pick-up-led').click(); // имитируем клик по Питеру, чтобы он встал по-умолчанию
//     };
//     getCitiesData('https://fake-json-shop-heroku.herokuapp.com/db');

//     // получаем айдишник города по клику на город и передаём его дальше
//     pickupCityNames.forEach(city => {
//         city.addEventListener('click', (event) => {
//             cityID = event.target.value;
//             // console.log(cityID);
//             createPickupPoints(cityID);
//         });
//     });    
// }() ); // самовызывающаяся анонимная ф-я


