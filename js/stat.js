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

var winMessageParams = {
  CONTENT: 'Ура вы победили! Список результатов:',
  X_OFFSET: 20,
  Y_OFFSET: 20,
  MAX_LINE_WIDTH: 200
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
var renderMultiLineText = function (ctx, message, text) {
  var words = message.CONTENT.split(' ');
  var currentLine = '';
  var testLine = '';
  var testLineWidth = 0;

  var messageX = cloudParams.X + message.X_OFFSET;
  var messageY = cloudParams.Y + message.Y_OFFSET;
  var currentLineY = messageY;

  ctx.font = text.FONT;
  ctx.fillStyle = text.COLOR;
  ctx.textBaseline = 'hanging';

  for (var i = 0; i < words.length; i++) {
    testLine = currentLine + words[i] + ' ';
    testLineWidth = ctx.measureText(testLine).width;

    if (testLineWidth > message.MAX_LINE_WIDTH) {
      ctx.fillText(currentLine, messageX, currentLineY);
      currentLine = words[i] + ' ';
      currentLineY += text.LINE_HEIGHT;
    } else {
      currentLine = testLine;
    }
  }
  ctx.fillText(currentLine, messageX, currentLineY);
};

// Функция генерации нового синего цвета с изменённой насыщенностью
var getBlueColor = function () {
  var color = barParams.OTHER_PLAYERS_COLOR;

  color.saturation = Math.floor(Math.random() * 100);

  return 'hsl(' + color.hue + ', ' + color.saturation + '%, ' + color.lightness + '%)';
};

// Функция определения цвета столбца в зависимости от имени пользователя
var getBarColor = function (name) {
  return name === 'Вы' ? barParams.CURRENT_PLAYER_COLOR : getBlueColor();
};

// Функция отрисовки столбца гистограммы с подписями
var renderBar = function (ctx, time, name, maxTime, orderNumber, histogramX, histogramY) {
  // Рисуем столбец
  var barHeight = (histogramParams.HEIGHT * time / maxTime) - timeParams.HEIGHT;
  var barX = histogramX + (barParams.GAP + barParams.WIDTH) * orderNumber;
  var barY = histogramY + (histogramParams.HEIGHT - barHeight);
  ctx.fillStyle = getBarColor(name);
  ctx.fillRect(barX, barY, barParams.WIDTH, barHeight);

  // Рисуем имя игрока
  var nameY = barY + barHeight + nameParams.MARGIN_TOP;
  ctx.font = textParams.FONT;
  ctx.fillStyle = textParams.COLOR;
  ctx.textBaseline = 'hanging';
  ctx.fillText(name, barX, nameY);

  // Рисуем время игрока
  var timeY = barY - timeParams.MARGIN_BOTTOM;
  time = Math.round(time);
  ctx.fillText(time, barX, timeY);
};

window.renderStatistics = function (ctx, names, times) {
  // Рисуем тень
  var shadowX = cloudParams.X + cloudParams.GAP;
  var shadowY = cloudParams.Y + cloudParams.GAP;
  renderCloud(ctx, shadowX, shadowY, cloudParams.SHADOW_COLOR);

  // Рисуем основное облако
  renderCloud(ctx, cloudParams.X, cloudParams.Y, cloudParams.MAIN_COLOR);

  // Рисуем сообщение о победе
  renderMultiLineText(ctx, winMessageParams, textParams);

  // Рисуем гистограмму
  var maxTime = Math.max.apply(null, times);
  var histogramX = cloudParams.X + histogramParams.X_OFFSET;
  var histogramY = cloudParams.Y + histogramParams.Y_OFFSET;
  for (var i = 0; i < names.length; i++) {
    renderBar(ctx, times[i], names[i], maxTime, i, histogramX, histogramY);
  }
};
