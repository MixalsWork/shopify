let filmValue = '';
let timeValue = '';
let dayValue = '';
let films = document.querySelector('.films');
let time = document.querySelector('.time');
let places = document.querySelector('.places');
let buttonBox = document.querySelector('.button-box');

function today() {
  let dates = document.querySelector('.dates');
  for (i = 0; i <= 6; i++) {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    let temp = startDate.toISOString().substr(0, 10);
    dates.insertAdjacentHTML('beforeend', `
    <div class='date__button-box'>
      <Button class='date__button' id=${temp} value=${temp}>${temp.slice(5)}</button>
    </div>
  `);
  };
  let datePicker = document.querySelectorAll('.date__button-box');
  datePicker.forEach(element => {
    element.addEventListener('click', function () {
      dayValue = element.children[0].value;
      let ChooseDate = new Date(dayValue);
      let options = {
        weekday: 'long'
      };
      dayValue = new Intl.DateTimeFormat('en-EN', options).format(ChooseDate);
      renderFilms();
      datePicker.forEach(element => {
        element.children[0].classList.remove('date__button-active')
      });
      element.children[0].classList.add('date__button-active')
      time.innerHTML = '';
      places.innerHTML = '';
      buttonBox.innerHTML = '';
    })
  });
}
today() // Выставляем максимальный срок бронирования отталкиваясь от сегодняшней даты и создаем 7 кнопок выбора даты

function renderFilms() {
  films.innerHTML = '';
  films.insertAdjacentHTML('afterbegin', `
        <label class="film">
            <input type="radio" name="film" value="filmOne">
            <img src="img/film-1.jpg">
          </label>
          
          <label class="film">
            <input type="radio" name="film" value="filmTwo">
            <img src="img/film-2.jpg">
          </label>`)
  let film = document.querySelectorAll('.film')
  film.forEach(element => {
    element.addEventListener('input', function () {
      filmValue = this.children[0].value;
      places.innerHTML = '';
      buttonBox.innerHTML = '';
      renderTime();
    });
  });
} // функция чистки елемента фильми и перерендринега его 

function renderTime() {
  time.innerHTML = '';
  time.insertAdjacentHTML('afterbegin', `
            <label class='time__ex'>
            10:00
            <input type="radio" name="time" value="am10">
        </label>
        <label class='time__ex'>
            12:00
            <input type="radio" name="time" value="am12">
        </label>
        <label class='time__ex'>
            14:00
            <input type="radio" name="time" value="am14">
        </label>
        <label class='time__ex'>
            16:00
            <input type="radio" name="time" value="am16">
        </label>
        <label class='time__ex'>
            18:00
            <input type="radio" name="time" value="am18">
        </label>
        <label class='time__ex'>
            20:00
            <input type="radio" name="time" value="am20">
        </label>`)
  let timeEx = document.querySelectorAll('.time__ex')
  timeEx.forEach(element => {
    element.addEventListener('input', function () {
      timeValue = this.children[0].value;
      $.getJSON("tickets.json", function (json) {
        tickets = json;
        if (localStorage.getItem(JSON.stringify({
            "day": dayValue,
            "film": filmValue,
            "time": timeValue
          })) === null) {
          localStorage.setItem(JSON.stringify({
            "day": dayValue,
            "film": filmValue,
            "time": timeValue
          }), JSON.stringify(tickets[dayValue][filmValue][timeValue]))
        } else {}
        renderPlaces();
        addButttonReseved();
      });
    })
  });
} // чистим елемент Время и рендерим его и добавляя обработчики событий

function renderPlaces() {
  let placesReserved = Object.values(JSON.parse(localStorage.getItem(JSON.stringify({
    "day": dayValue,
    "film": filmValue,
    "time": timeValue
  }))));
  places.innerHTML = '';
  let placeNumber = 0;
  placesReserved.forEach(element => {
    placeNumber++;
    if (element == 'empty') {
      places.insertAdjacentHTML('beforeend', `
      <div class="place">
              <input type="checkbox" id="${placeNumber}" name="${placeNumber}" >
              <label for="scales">${placeNumber}</label>
          </div>
    `);
    }
    if (element == 'reserved') {
      places.insertAdjacentHTML('beforeend', `
      <div class="place">
              <input type="checkbox" id="${placeNumber}" name="${placeNumber}" disabled >
              <label for="scales">${placeNumber}</label>
          </div>
    `);
    }
  });
}; // Чистим елемент Места и рендерим туда места отталкиваясь от занятых\свободных мест

function addButttonReseved() {
  buttonBox.innerHTML = '';
  buttonBox.insertAdjacentHTML('beforeend', `
          <button class="button__reserved">Reserved</button>
  `);
  let butttonReseved = document.querySelector('.button__reserved');
  butttonReseved.addEventListener('click', reserved)
}; // Добавляем кнопку резервирования и вешаем на нее обработчик событий

function reserved() {
  let places = document.querySelectorAll('.place');
  let reservedPlaces = [];
  places.forEach(element => {
    if (element.children[0].checked || element.children[0].disabled) {
      reservedPlaces.push('reserved');
      return
    }
    if (!element.children[0].checked && element.children[0].disabled) {
      reservedPlaces.push('reserved');
      return
    }
    if (!element.children[0].checked) {
      reservedPlaces.push('empty')
      return
    }
  });
  let choosePlaces = JSON.parse(localStorage.getItem(JSON.stringify({
    "day": dayValue,
    "film": filmValue,
    "time": timeValue
  })));
  choosePlaces.one = reservedPlaces[0];
  choosePlaces.two = reservedPlaces[1];
  choosePlaces.three = reservedPlaces[2];
  choosePlaces.four = reservedPlaces[3];
  localStorage.removeItem(JSON.stringify({
    "day": dayValue,
    "film": filmValue,
    "time": timeValue
  }));
  localStorage.setItem(JSON.stringify({
    "day": dayValue,
    "film": filmValue,
    "time": timeValue
  }), JSON.stringify(choosePlaces));
  renderPlaces()
} // Меняем Куки и резервируем места таким образом и еще раз обновляем содержимое мест что-бы было видно что они зарезезервилоись



//Хочу сказать что я отталкивался от того что мой JSON файл это не база билетов а изаначально база дней-фильмов-сеансов и свободных мест 
// куда в свою очередь и попадали бы занятые места , а там уже внутри каждого места был бы билет ( имя фамиля и тп тп );
//спасибо за интерестное задание на функцыонал ушло примерно 8 часов  + 2 часа замены инпута даты  на инпут радио ( так как не знал что он не работает на сафари)