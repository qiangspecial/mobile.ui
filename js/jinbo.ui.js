var ui = ui || {};


/**
 * 弹出对话框插件
 * 调用方法: ui.dialog(o);
 * o: {}
 */
ui.dialog = (function($) {
	// dialog 默认参数
	var _option = {
		content: "",			// String   弹出对话框的内容
		needOverlay: true,		// Boolean  是否添加遮罩层
		autoClose: 0,			// Number   是否自动关闭弹出窗
		autoCloseTime: 3000,	// Number   自动关闭弹出层的时间, 默认3000ms
		beforeInit: null,
		beforeClose: null, 
		callback: null			// Function 关闭弹出层执行的回调函数
	},
	_getOverlay = function() {
		var $overlay = $("#ui-overlay");

		// if ($overlay[0]) {
		// 	$overlay.empty();
		// } else {
		// 	$overlay = $('<div id="ui-overlay" class="ui-overlay"></div>');
		// }
		return $overlay[0] ? $overlay.empty() : $('<div id="ui-overlay" class="ui-overlay"></div>');
	};

	var _fnDialog = function(o) {
		var $overlay = _getOverlay(),
			dialog = {};

		o = $.extend({}, _option, o);	// 合并参数

		$("body").append($overlay.html(o.content));
		$overlay.show(200).on("touchmove", function(e) {
			e.preventDefault();
		});
		dialog.$ = $overlay;
		dialog.close = function() {
			o.callback && o.callback.call($overlay[0]); // 执行回调函数
			$overlay.hide(function() {
				$overlay.remove();
			});
		};

		$overlay.on("touchend", ".close", dialog.close);
		return dialog;
	};

	return _fnDialog;
}(typeof Zepto !== "undefined" ? Zepto : jQuery));


/* 弹出对话框插件 */
;(function($) {
	var _option = {
		html: "",					// string   弹出对话框的内容
		container: null,			// string   弹处层内容的id
		needOverlay: true,			// boolean  是否添加遮罩层
		autoClose: 0,				// number   自动关闭弹出层的时间
		callback: null				// function 关闭弹出层执行的回调函数
	},
	_$notNeedOverlay = null;

	$.extend($, {
		dialog: function(option) {
			var o = $.extend({}, _option, option),
				$overlay = function() {
					var _overlay = $("#overlay");

					if (_$notNeedOverlay) {
						_$notNeedOverlay.remove();
						_$notNeedOverlay = null;
					}
					if (o.needOverlay) {

						return _overlay[0] ? _overlay.empty().html(o.html) : $('<div id="overlay" class="overlay"></div>').html(o.html);
					} else {
						if (_overlay[0]) _overlay.remove();
						return (_$notNeedOverlay = $(o.html));
					}
				}(),
				dialog = {			// 开放给外部的接口
					$: null,		// {$()} 弹出对话框对象
					close: null		// {function} 关闭事件
				};

			$("body").append($overlay);
			$overlay.show(200).on("touchmove", function(e) {
				e.preventDefault();
			});
			dialog.$ = $overlay;
			dialog.close = function() {

				o.callback && o.callback.call($overlay[0]);	// 执行回调函数
				$overlay.animate({"opacity": 0}, 100, function() {
					$overlay.remove();
				});
			};

			$overlay.on("click", ".close", dialog.close);
			return dialog;
		}
	});
}(((typeof jQuery !== "undefined") ? jQuery : Zepto)));