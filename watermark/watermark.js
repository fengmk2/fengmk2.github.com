/*!
 * watermark.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

(function ($) {

  "use strict";

  $.fn.extend({
    watermark: function (opts) {
      var defaults = {
        width: 230,
        height: 100,
        backgroundColor: '#fff',
        startX: 40,
        startY: 50,
        fontSize: 18,
        text: '水印啦',
        textFamily: '"微软雅黑"',
        fillStyle: '#f5f5f5'
      };
      opts = opts || {};
      var options = {};
      for (var k in defaults) {
        options[k] = opts[k] || defaults[k];
      }

      // init global canvas
      var canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:none;';
      canvas.width = options.width;
      canvas.height = options.height;
      var ctx = canvas.getContext('2d');
      // set background color
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, options.width, options.height);
      document.body.appendChild(canvas);
      var x = options.startX;
      var y = options.startY;
      var text = options.text;
      ctx.fillStyle = options.fillStyle;
      ctx.font = options.fontSize + 'px ' + options.textFamily;
      for (var i = 0; i < text.length; i++) {
        var s = text[i];
        ctx.fillText(s, x, y);
        x += options.fontSize;
        y += options.fontSize;
      }
      var background = options.backgroundColor + ' url(' + canvas.toDataURL() + ') repeat';
      document.body.removeChild(canvas);
      return this.each(function () {
        this.style.background = background;
      });
    }
  });
})(jQuery);
