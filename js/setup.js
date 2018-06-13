'use strict';

// Данные для генерации случайных магов
var NUM_OF_SIMILAR_WIZARDS = 4;
var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var openDialogBlock = document.querySelector('.setup-open');
var openDialogImage = openDialogBlock.querySelector('.setup-open-icon');
var userDialog = document.querySelector('.setup');
var userNameInput = userDialog.querySelector('.setup-user-name');
var closeDialogButton = userDialog.querySelector('.setup-close');

var wizardCoat = userDialog.querySelector('.setup-wizard .wizard-coat');
var wizardCoatInput = userDialog.querySelector('input[name="coat-color"]');

var wizardEyes = userDialog.querySelector('.setup-wizard .wizard-eyes');
var wizardEyesInput = userDialog.querySelector('input[name="eyes-color"]');

var fireball = userDialog.querySelector('.setup-fireball-wrap');
var fireballInput = userDialog.querySelector('input[name="fireball-color"]');

var template = document.querySelector('#similar-wizard-template');
var similarWizardTemplate = template.content.querySelector('.setup-similar-item');

// Функция, возвращающая случайно перемешанную копию массива (тасование Фишера — Йетса)
var getShuffledArray = function (array) {
  var shuffledArray = array.slice(0);

  for (var i = array.length - 1; i > 0; i--) {
    var swapIndex = Math.round(Math.random() * i);
    var swap = shuffledArray[swapIndex];
    shuffledArray[swapIndex] = shuffledArray[i];
    shuffledArray[i] = swap;
  }

  return shuffledArray;
};

// Функция создания полного имени из имени и фамилии
var getFullName = function (wizardNumber) {
  var name = shuffledNames[wizardNumber];
  var surname = shuffledSurnames[wizardNumber];

  return name + ' ' + surname;
};

// Функция создания похожего персонажа
var generateSimilarWizard = function (wizardNumber) {
  return {
    name: getFullName(wizardNumber),
    coatColor: shuffledCoatColors[wizardNumber],
    eyesColor: shuffledEyesColors[wizardNumber]
  };
};

// Функция создания массива похожих персонажей
var generateSimilarWizards = function (numberOfWizards) {
  var randomWizards = [];

  for (var i = 0; i < numberOfWizards; i++) {
    randomWizards.push(generateSimilarWizard(i));
  }

  return randomWizards;
};

// Функция создания DOM-элемента волшебника на основе объекта с данными
var createWizardElement = function (wizardData) {
  var wizardElement = similarWizardTemplate.cloneNode(true);

  wizardElement.querySelector('.setup-similar-label').textContent = wizardData.name;
  wizardElement.querySelector('.wizard-coat').style.fill = wizardData.coatColor;
  wizardElement.querySelector('.wizard-eyes').style.fill = wizardData.eyesColor;

  return wizardElement;
};

// Функция заполнения фрагмента DOM-элементами на основе массива с похожими волшебниками
var createWizardsFragment = function () {
  var similarWizards = generateSimilarWizards(NUM_OF_SIMILAR_WIZARDS);
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < similarWizards.length; i++) {
    fragment.appendChild(createWizardElement(similarWizards[i]));
  }

  return fragment;
};

var openUserDialog = function () {
  userDialog.classList.remove('hidden');
  document.addEventListener('keydown', userDialogEscPressHandler);
};

var userDialogEscPressHandler = function (evt) {
  var isEscapePressed = evt.keyCode === ESC_KEYCODE;
  var isInputInFocus = document.activeElement === userNameInput;

  if (isEscapePressed && !isInputInFocus) {
    closeUserDialog();
  }
};

var closeUserDialog = function () {
  userDialog.classList.add('hidden');
  document.removeEventListener('keydown', userDialogEscPressHandler);
};

/**
 * @param {string} property - свойство, которое необходимо изменить
 * @param {HTMLElement} element - элемент, у которого изменяется цвет
 * @param {Array.<string>} colors - список доступных цветов
 * @param {HTMLInputElement} inputElement - поле ввода, содержащее значение текущего цвета
 */
var changeElementColor = function (property, element, colors, inputElement) {
  var currentColor = inputElement.value;
  var currentColorIndex = colors.indexOf(currentColor);
  var lastColorIndex = colors.length - 1;
  var newColor = (currentColorIndex === lastColorIndex) ? colors[0] : colors[currentColorIndex + 1];

  if (property === 'fill') {
    element.style.fill = newColor;
  }

  if (property === 'bgColor') {
    element.style.backgroundColor = newColor;
  }

  inputElement.value = newColor;
};


// Функция инициализации страницы
var initPage = function () {
  openDialogBlock.addEventListener('click', function () {
    openUserDialog();
  });

  openDialogImage.addEventListener('click', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openUserDialog();
    }
  });

  closeDialogButton.addEventListener('click', function () {
    closeUserDialog();
  });

  wizardCoat.addEventListener('click', function (evt) {
    changeElementColor('fill', evt.target, COAT_COLORS, wizardCoatInput);
  });

  wizardEyes.addEventListener('click', function (evt) {
    changeElementColor('fill', evt.target, EYES_COLORS, wizardEyesInput);
  });

  fireball.addEventListener('click', function (evt) {
    changeElementColor('bgColor', evt.target, FIREBALL_COLORS, fireballInput);
  });

  // Добавляем фрагмент с похожими волшебниками в нужный блок
  userDialog.querySelector('.setup-similar-list').appendChild(createWizardsFragment());

  // Показываем блок с похожими волшебниками
  userDialog.querySelector('.setup-similar').classList.remove('hidden');
};

// Генерация перетасованных массивов
var shuffledNames = getShuffledArray(NAMES);
var shuffledSurnames = getShuffledArray(SURNAMES);
var shuffledCoatColors = getShuffledArray(COAT_COLORS);
var shuffledEyesColors = getShuffledArray(EYES_COLORS);

initPage();
