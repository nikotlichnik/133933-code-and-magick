'use strict';

// Данные для генерации случайных магов
var NUM_OF_SIMILAR_WIZARDS = 4;
var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];
var FIREBALL_COLORS = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

var KEYCODES = {
  ENTER: 13,
  ESC: 27
};

/**
 * @type {object}
 * @property {string} DEFAULT_OFFSET_LEFT
 * @property {string} DEFAULT_OFFSET_TOP
 */
var userDialogParams = {
  DEFAULT_OFFSET_LEFT: '50%',
  DEFAULT_OFFSET_TOP: '80px'
};

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

var dialogHandle = userDialog.querySelector('.upload');

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

var closeDialogButtonClickHandler = function () {
  closeUserDialog();
};

var closeDialogButtonEscPressHandler = function (evt) {
  if (evt.keyCode === KEYCODES.ENTER) {
    closeUserDialog();
  }
};

var wizardCoatClickHandler = function (evt) {
  changeElementColor('fill', evt.target, COAT_COLORS, wizardCoatInput);
};


var wizardEyesClickHandler = function (evt) {
  changeElementColor('fill', evt.target, EYES_COLORS, wizardEyesInput);
};


var fireballClickHandler = function (evt) {
  changeElementColor('bgColor', evt.target, FIREBALL_COLORS, fireballInput);
};

var userDialogEscPressHandler = function (evt) {
  var isEscapePressed = evt.keyCode === KEYCODES.ESC;
  var isInputInFocus = document.activeElement === userNameInput;

  if (isEscapePressed && !isInputInFocus) {
    closeUserDialog();
  }
};

var dialogHandleDragHandler = function (downEvt) {
  var startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY
  };

  var dragged = false;

  var dialogMouseMoveHandler = function (moveEvt) {
    var shift = {
      x: moveEvt.clientX - startCoords.x,
      y: moveEvt.clientY - startCoords.y
    };

    dragged = true;

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    userDialog.style.left = (userDialog.offsetLeft + shift.x) + 'px';
    userDialog.style.top = (userDialog.offsetTop + shift.y) + 'px';
  };

  var dialogMouseUpHandler = function () {
    if (dragged) {
      var inputClickHandler = function (clickEvt) {
        clickEvt.preventDefault();
        dialogHandle.removeEventListener('click', inputClickHandler);
      };
      dialogHandle.addEventListener('click', inputClickHandler);
    }

    document.removeEventListener('mousemove', dialogMouseMoveHandler);
    document.removeEventListener('mouseup', dialogMouseUpHandler);
  };

  document.addEventListener('mousemove', dialogMouseMoveHandler);
  document.addEventListener('mouseup', dialogMouseUpHandler);
};

var openUserDialog = function () {
  userDialog.style.left = userDialogParams.DEFAULT_OFFSET_LEFT;
  userDialog.style.top = userDialogParams.DEFAULT_OFFSET_TOP;

  userDialog.classList.remove('hidden');

  document.addEventListener('keydown', userDialogEscPressHandler);
  closeDialogButton.addEventListener('click', closeDialogButtonClickHandler);
  closeDialogButton.addEventListener('keydown', closeDialogButtonEscPressHandler);
  wizardCoat.addEventListener('click', wizardCoatClickHandler);
  wizardEyes.addEventListener('click', wizardEyesClickHandler);
  fireball.addEventListener('click', fireballClickHandler);

  dialogHandle.addEventListener('mousedown', dialogHandleDragHandler);
};

var closeUserDialog = function () {
  userDialog.classList.add('hidden');

  wizardCoat.removeEventListener('click', wizardCoatClickHandler);
  wizardEyes.removeEventListener('click', wizardEyesClickHandler);
  fireball.removeEventListener('click', fireballClickHandler);
  document.removeEventListener('keydown', userDialogEscPressHandler);
  closeDialogButton.removeEventListener('click', closeDialogButtonClickHandler);
  closeDialogButton.removeEventListener('keydown', closeDialogButtonEscPressHandler);
  dialogHandle.removeEventListener('mousedown', dialogHandleDragHandler);
};

// Функция инициализации страницы
var initPage = function () {
  openDialogBlock.addEventListener('click', function () {
    openUserDialog();
  });

  openDialogImage.addEventListener('keydown', function (evt) {
    if (evt.keyCode === KEYCODES.ENTER) {
      openUserDialog();
    }
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
