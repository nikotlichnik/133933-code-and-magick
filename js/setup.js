'use strict';

// Данные для генерации случайных магов
var NUM_OF_SIMILAR_WIZARDS = 4;
var NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
var SURNAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
var COAT_COLORS = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
var EYES_COLORS = ['black', 'red', 'blue', 'yellow', 'green'];


// Функция, возвращающая случайное число от нуля до переданного параметра включительно
var getRandomNumberInRange = function (endBorder) {
  return Math.round(Math.random() * endBorder);
};

// Функция, возвращающая случайно перемешанную копию массива (тасование Фишера — Йетса)
var getShuffledArray = function (array) {
  var shuffledArray = array.slice(0);

  for (var i = array.length - 1; i > 0; i--) {
    var swapIndex = getRandomNumberInRange(i);
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
  var randomWizardData = {
    name: '',
    coatColor: '',
    eyesColor: ''
  };

  randomWizardData.name = getFullName(wizardNumber);
  randomWizardData.coatColor = shuffledCoatColors[wizardNumber];
  randomWizardData.eyesColor = shuffledEyesColors[wizardNumber];

  return randomWizardData;
};

// Функция создания массива похожих персонажей
var generateSimilarWizards = function () {
  var randomWizards = [];

  for (var i = 0; i < NUM_OF_SIMILAR_WIZARDS; i++) {
    randomWizards.push(generateSimilarWizard(i));
  }

  return randomWizards;
};

// Функция создания DOM-элемента волшебника на основе объекта с данными
var createWizardElement = function (wizardData) {
  var template = document.querySelector('#similar-wizard-template');
  var similarWizardTemplate = template.content.querySelector('.setup-similar-item');
  var wizardElement = similarWizardTemplate.cloneNode(true);

  wizardElement.querySelector('.setup-similar-label').textContent = wizardData.name;
  wizardElement.querySelector('.wizard-coat').style.fill = wizardData.coatColor;
  wizardElement.querySelector('.wizard-eyes').style.fill = wizardData.eyesColor;

  return wizardElement;
};

// Функция заполнения фрагмента DOM-элементами на основе массива с похожими волшебниками
var createWizardsFragment = function () {
  var similarWizards = generateSimilarWizards();
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < similarWizards.length; i++) {
    fragment.appendChild(createWizardElement(similarWizards[i]));
  }

  return fragment;
};

// Генерация перетасованных массивов
var shuffledNames = getShuffledArray(NAMES);
var shuffledSurnames = getShuffledArray(SURNAMES);
var shuffledCoatColors = getShuffledArray(COAT_COLORS);
var shuffledEyesColors = getShuffledArray(EYES_COLORS);

// Показываем окно настройки
var userDialog = document.querySelector('.setup');
userDialog.classList.remove('hidden');

// Создаём фрагмент, содержащий похожих волшебников
var similarWizardsFragment = createWizardsFragment();

// Добавляем фрагмент с похожими волшебниками в нужный блок
userDialog.querySelector('.setup-similar-list').appendChild(similarWizardsFragment);

// Показываем блок с похожими волшебниками
userDialog.querySelector('.setup-similar').classList.remove('hidden');