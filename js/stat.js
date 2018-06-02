'use strict';

var CLOUD_WIDTH = 420;
var CLOUD_HEIGHT = 270;
var CLOUD_X = 100;
var CLOUD_Y = 10;
var CLOUD_MAIN_COLOR = '#FFF';
var CLOUD_SHADOW_COLOR = 'rgba(0, 0, 0, 0.7)';
var CLOUD_GAP = 10;

var MESSAGE_TEXT = 'Ура вы победили!\nСписок результатов:';
var MESSAGE_FONT = '16px "PT Mono"';
var MESSAGE_LINE_HEIGHT = 25;
var MESSAGE_X_OFFSET = 25;
var MESSAGE_Y_OFFSET = 25;
var MESSAGE_COLOR = '#000';


var renderCloud = function (ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
};

// Функция отрисовки на канвасе многострочного текста
var renderCloudText = function (ctx, x, y, text) {
  var textLines = text.split('\n');

  ctx.font = MESSAGE_FONT;
  ctx.textBaseline = 'hanging';
  ctx.fillStyle = MESSAGE_COLOR;

  for (var i = 0; i < textLines.length; i++) {
    ctx.fillText(textLines[i], x, y + MESSAGE_LINE_HEIGHT * i);
  }
};

window.renderStatistics = function (ctx, names, times) {
  renderCloud(ctx, CLOUD_X + CLOUD_GAP, CLOUD_Y + CLOUD_GAP, CLOUD_SHADOW_COLOR);
  renderCloud(ctx, CLOUD_X, CLOUD_Y, CLOUD_MAIN_COLOR);

  renderCloudText(ctx, CLOUD_X + MESSAGE_X_OFFSET, CLOUD_Y + MESSAGE_Y_OFFSET, MESSAGE_TEXT);
};
