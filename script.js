let filmValue= '';
let timeValue= '';
let dayValue = '';
let films = document.querySelector('.films');
let time = document.querySelector('.time');
let places = document.querySelector('.places');
let buttonBox = document.querySelector('.button-box');

function today() {
  let today = new Date();
  let maxValue = new Date();
  // maxValue.setDate(maxValue.getDate() + 6);
  // myDate.min = today.toISOString().substr(0, 10);
  // myDate.max = maxValue.toISOString().substr(0, 10);
  let main = document.querySelector('.main');
  for(i=0; i<=6;i++){
    let startDate = new Date();
    startDate.setDate(startDate.getDate() + i);
    let temp = startDate.toISOString().substr(0, 10);
    main.insertAdjacentHTML('beforeend', `
    <label class='date__button'>
      ${temp}
      <input type="radio" name="date" id=${temp} value=${temp}>
    </label>
  `);
  };
  let datePicker = document.querySelectorAll('.date__button');
  datePicker.forEach(element => {
    element.addEventListener('input',function(){
      dayValue = element.children[0].value;
      let ChooseDate = new Date(dayValue);
      let options = {
        weekday: 'long'
      };
      dayValue = new Intl.DateTimeFormat('en-EN', options).format(ChooseDate);
      renderFilms();
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
      console.log(filmValue)
      renderTime();
    });
  });
} // функция чистки елемента фильми и перерендринега его 

function renderTime(){
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
          element.addEventListener('input', function(){
            timeValue = this.children[0].value;
            $.getJSON( "tickets.json", function( json ){
              console.log(JSON.stringify({"day":dayValue,"film":filmValue}))
              tickets = json;
              if(localStorage.getItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue})) === null){
                localStorage.setItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue}),JSON.stringify(tickets[dayValue][filmValue][timeValue]))
              }else{
                console.log('est')
              }
              renderPlaces();
              addButttonReseved();
            });
          })
        });
} // чистим елемент Время и рендерим его и добавляя обработчики событий

function renderPlaces(){
  let placesReserved = Object.values(JSON.parse(localStorage.getItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue}))));
  places.innerHTML = '';
  let placeNumber = 0;
  placesReserved.forEach(element => {
    placeNumber++;
    if(element == 'empty'){
      places.insertAdjacentHTML('beforeend', `
      <div class="place">
              <input type="checkbox" id="${placeNumber}" name="${placeNumber}" >
              <label for="scales">${placeNumber}</label>
          </div>
    `);
    }
    if(element == 'reserved'){
      places.insertAdjacentHTML('beforeend', `
      <div class="place">
              <input type="checkbox" id="${placeNumber}" name="${placeNumber}" disabled >
              <label for="scales">${placeNumber}</label>
          </div>
    `);
    }
  });
}; // Чистим елемент Места и рендерим туда места отталкиваясь от занятых\свободных мест

function addButttonReseved(){
  buttonBox.innerHTML = '';
  buttonBox.insertAdjacentHTML('beforeend', `
          <button class="button__reserved">Reserved</button>
  `);
  let butttonReseved = document.querySelector('.button__reserved');
  butttonReseved.addEventListener('click', reserved)
}; // Добавляем кнопку резервирования и вешаем на нее обработчик событий

function reserved(){
  let places = document.querySelectorAll('.place');
  let reservedPlaces = [];
  places.forEach(element => {
    if(element.children[0].checked || element.children[0].disabled){
      reservedPlaces.push('reserved');
      return
    }
    if(!element.children[0].checked && element.children[0].disabled){
      reservedPlaces.push('reserved');
      return
    }
    if(!element.children[0].checked){
      reservedPlaces.push('empty')
      return
    }
  });
    let choosePlaces = JSON.parse(localStorage.getItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue})));
    choosePlaces.one = reservedPlaces[0];
    choosePlaces.two = reservedPlaces[1];
    choosePlaces.three = reservedPlaces[2];
    choosePlaces.four = reservedPlaces[3];
    localStorage.removeItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue}));
    localStorage.setItem(JSON.stringify({"day":dayValue,"film":filmValue,"time":timeValue}),JSON.stringify(choosePlaces));
    renderPlaces()
} // Меняем Куки и резервируем места таким образом и еще раз обновляем содержимое мест что-бы было видно что они зарезезервилоись

// myDate.addEventListener('input', function () {
//   let chooseDate = new Date(myDate.value);
//   console.log(myDate.value);
//   console.log(dayValue);
//   let newChooseDate = new Date(dayValue);
//   let weekday = chooseDate.getDay();
//   let options = {
//     weekday: 'long'
//   };
//   renderFilms()
//   dayValue = new Intl.DateTimeFormat('en-EN', options).format(chooseDate);
//   dayValue = new Intl.DateTimeFormat('en-EN', options).format(newChooseDate);
//   console.log(chooseDate)
//   console.log(newChooseDate);
//   console.log(myDate.value);
//   console.log(dayValue)
//   console.log(dayValue)
// }) // при выборе даты показываються фильмы на которые можно пойти , при смене даты чиситить елемент и показываються новые
// Вешаем обработчик событий для получения дня недели , от дня недели у меня будут меняться фильмы для сеансов


//Хочу сказать что я отталкивался от того что мой JSON файл это не база билетов а изаначально база дней-фильмов-сеансов и свободных мест 
// куда в свою очередь и попадали бы занятые места , а там уже внутри каждого места был бы билет ( имя фамиля и тп тп );
//На мое мнение как-то все коряво но работает , спасибо за интерестное задание на функцыонал ушло примерно 8 часов  + 2 часа замены инпута даты  на инпут радио ( так как не знал что он не работает на сафари)