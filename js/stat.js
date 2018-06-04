'use strict';

var cloudParams = {
  WIDTH: 420,
  HEIGHT: 270,
  X: 100,
  Y: 10,
  MAIN_COLOR: 'rgba(255, 255, 255, 1)',
  SHADOW_COLOR: 'rgba(0, 0, 0, 0.7)',
  GAP: 10
};

var textParams = {
  FONT: '16px "PT Mono"',
  LINE_HEIGHT: 20,
  COLOR: 'rgba(0, 0, 0, 1)'
};

var messageParams = {
  CONTENT: 'Ура вы победили!\nСписок результатов:',
  X_OFFSET: 20,
  Y_OFFSET: 20
};

var histogramParams = {
  HEIGHT: 150,
  X_OFFSET: 40,
  Y_OFFSET: 80
};

var barParams = {
  WIDTH: 40,
  GAP: 50,
  CURRENT_PLAYER_COLOR: 'rgba(255, 0, 0, 1)',
  OTHER_PLAYERS_COLOR: {
    hue: 236,
    saturation: 0,
    lightness: 50
  }
};

var timeParams = {
  HEIGHT: 10,
  MARGIN_BOTTOM: 20
};

var nameParams = {
  MARGIN_TOP: 10
};

// Функция отрисовки облака
var renderCloud = function (ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, cloudParams.WIDTH, cloudParams.HEIGHT);
};

// Функция отрисовки на канвасе многострочного текста
var renderCloudText = function (ctx, x, y, text) {
  var textLines = text.split('\n');

  ctx.font = textParams.FONT;
  ctx.fillStyle = textParams.COLOR;
  ctx.textBaseline = 'hanging';

  for (var i = 0; i < textLines.length; i++) {
    var lineY = y + textParams.LINE_HEIGHT * i;
    ctx.fillText(textLines[i], x, lineY);
  }
};

// Функция генерации нового синего цвета с изменённой насыщенностью
var getBlueColor = function () {
  var color = barParams.OTHER_PLAYERS_COLOR;

  color.saturation = Math.floor(Math.random() * 100);

  return 'hsl(' + color.hue + ', ' + color.saturation + '%, ' + color.lightness + '%)';
};

// Функция определения цвета столбца в зависимости от имени пользователя
var getColor = function (name) {
  return name === 'Вы' ? barParams.CURRENT_PLAYER_COLOR : getBlueColor();
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
  var histogramX = cloudParams.X + histogramParams.X_OFFSET;
  var histogramY = cloudParams.Y + histogramParams.Y_OFFSET;

  for (var i = 0; i < names.length; i++) {
    // Рисуем столбец
    var barHeight = (histogramParams.HEIGHT * times[i] / maxTime) - timeParams.HEIGHT;
    var barX = histogramX + barParams.GAP * i + barParams.WIDTH * i;
    var barY = histogramY + (histogramParams.HEIGHT - barHeight);
    ctx.fillStyle = getColor(names[i]);
    ctx.fillRect(barX, barY, barParams.WIDTH, barHeight);

    // Рисуем имя игрока
    var nameY = barY + barHeight + nameParams.MARGIN_TOP;
    renderCloudText(ctx, barX, nameY, names[i]);

    // Рисуем время игрока
    var time = Math.round(times[i]).toString();
    var timeY = barY - timeParams.MARGIN_BOTTOM;
    renderCloudText(ctx, barX, timeY, time);
  }
};

window.renderStatistics = function (ctx, names, times) {
  // Рисуем тень
  var shadowX = cloudParams.X + cloudParams.GAP;
  var shadowY = cloudParams.Y + cloudParams.GAP;
  renderCloud(ctx, shadowX, shadowY, cloudParams.SHADOW_COLOR);

  // Рисуем основное облако
  renderCloud(ctx, cloudParams.X, cloudParams.Y, cloudParams.MAIN_COLOR);

  // Рисуем сообщение о победе
  var messageX = cloudParams.X + messageParams.X_OFFSET;
  var messageY = cloudParams.Y + messageParams.Y_OFFSET;
  renderCloudText(ctx, messageX, messageY, messageParams.CONTENT);

  // Рисуем гистограмму
  renderHistogram(ctx, names, times);
};
