'use strict';

// Параметры облаков
var CLOUD_WIDTH = 420;
var CLOUD_HEIGHT = 270;
var CLOUD_X = 100;
var CLOUD_Y = 10;
var CLOUD_MAIN_COLOR = '#FFF';
var CLOUD_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)';
var CLOUD_GAP = 10;

// Параметры отрисовки текста в облаке
var TEXT_FONT = '16px "PT Mono"';
var TEXT_LINE_HEIGHT = 20;
var TEXT_COLOR = '#000';

// Параметры сообщения о победе
var MESSAGE_TEXT = 'Ура вы победили!\nСписок результатов:';
var MESSAGE_X_OFFSET = 20;
var MESSAGE_Y_OFFSET = 20;

// Параметры гистограммы
var HISTOGRAM_HEIGHT = 150;
var HISTOGRAM_X_OFFSET = 40;
var HISTOGRAM_Y_OFFSET = 80;
var BAR_WIDTH = 40;
var BAR_GAP = 50;
var BAR_CURRENT_PLAYER_COLOR = '#F00';
var BAR_OTHER_PLAYERS_COLOR = {
  hue: 236,
  saturation: 0,
  lightness: 50
};
var TIME_BOTTOM_OFFSET = 20;
var TIME_HEIGHT = 10;
var NAME_TOP_OFFSET = 10;

// Функция отрисовки облака
var renderCloud = function (ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
};

// Функция отрисовки на канвасе многострочного текста
var renderCloudText = function (ctx, x, y, text) {
  var textLines = text.split('\n');

  ctx.font = TEXT_FONT;
  ctx.fillStyle = TEXT_COLOR;
  ctx.textBaseline = 'hanging';

  for (var i = 0; i < textLines.length; i++) {
    var lineY = y + TEXT_LINE_HEIGHT * i;
    ctx.fillText(textLines[i], x, lineY);
  }
};

// Функция генерации нового цвета с изменённой насыщенностью
var generateNewColor = function (color) {
  color.saturation = Math.floor(Math.random() * 100);
  return 'hsl(' + color.hue + ', ' + color.saturation + '%, ' + color.lightness + '%)';
};

// Функция определения цвета столбца в зависимости от имени пользователя
var getColor = function (name) {
  return name === 'Вы' ? BAR_CURRENT_PLAYER_COLOR : generateNewColor(BAR_OTHER_PLAYERS_COLOR);
};

// Функция поиска максимального элемента в массиве
var getMaxElement = function (arr) {
  var maxElement = arr[0];

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > maxElement) {
      maxElement = arr[i];
    }
  }

  return maxElement;
};

// Функция отрисовки гистограммы с подписями у столбцов
var renderHistogram = function (ctx, names, times) {
  var maxTime = getMaxElement(times);
  var histogramX = CLOUD_X + HISTOGRAM_X_OFFSET;
  var histogramY = CLOUD_Y + HISTOGRAM_Y_OFFSET;

  for (var i = 0; i < names.length; i++) {
    // Рисуем столбец
    var barHeight = (HISTOGRAM_HEIGHT * times[i] / maxTime) - TIME_HEIGHT;
    var barX = histogramX + BAR_GAP * i + BAR_WIDTH * i;
    var barY = histogramY + (HISTOGRAM_HEIGHT - barHeight);
    ctx.fillStyle = getColor(names[i]);
    ctx.fillRect(barX, barY, BAR_WIDTH, barHeight);

    // Рисуем имя игрока
    var nameY = barY + barHeight + NAME_TOP_OFFSET;
    renderCloudText(ctx, barX, nameY, names[i]);

    // Рисуем время игрока
    var time = Math.round(times[i]).toString();
    var timeY = barY - TIME_BOTTOM_OFFSET;
    renderCloudText(ctx, barX, timeY, time);
  }
};

window.renderStatistics = function (ctx, names, times) {
  // Рисуем тень
  var shadowX = CLOUD_X + CLOUD_GAP;
  var shadowY = CLOUD_Y + CLOUD_GAP;
  renderCloud(ctx, shadowX, shadowY, CLOUD_SHADOW_COLOR);

  // Рисуем основное облако
  renderCloud(ctx, CLOUD_X, CLOUD_Y, CLOUD_MAIN_COLOR);

  // Рисуем сообщение о победе
  var messageX = CLOUD_X + MESSAGE_X_OFFSET;
  var messageY = CLOUD_Y + MESSAGE_Y_OFFSET;
  renderCloudText(ctx, messageX, messageY, MESSAGE_TEXT);

  // Рисуем гистограмму
  renderHistogram(ctx, names, times);
};
