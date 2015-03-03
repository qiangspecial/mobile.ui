var ui = ui || {};

/**
 * 弹出对话框插件
 * 调用方法: ui.dialog(o);
 * o: {}
 */
(function(ui, $) {
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
	_getOverlay = function(needOverlay) {
		var $overlay = $("#ui-overlay"),
			// 判断是否需要遮罩层(遮罩始终存在,只是显示为 灰色/透明 之分)
			overlayContent = '<div id="ui-overlay" class="' + (needOverlay ? 'ui-overlay ' : '') + 'ui-fixed-center"></div>';

		// 删除原有的弹出框
		$overlay[0] && $overlay.remove();
		return $(overlayContent);
	};

	// 默认显示的对话框
	_option.content = '<div class="ui-dialog ui-center">' +
		'<h4 class="ui-dialog-title">财宝宝提示：</h4>' +
		'<p class="text-center fz14">密码错误密码错误密码错误密码错误密码错误密码错误密码错误密码错误</p>' +
		'<div class="ui-btn-group mgt15">' +
			'<a href="javascript:;" class="ui-btn">确认</a>' +
			'<a href="javascript:;" class="ui-btn" data-type="close">取消</a>' +
		'</div>' +
	'</div>';
	ui.dialog = function(o) {
		var $overlay,
			dialog = {};

		o = $.extend({}, _option, o);			// 合并参数
		$overlay = _getOverlay(o.needOverlay); 	// 获取遮罩

		$("body").append($overlay.html(o.content));
		// 禁止滑动页面
		$overlay.show(200).on("touchmove", function(e) {
			e.preventDefault();
		});
		dialog.$ = $overlay;
		dialog.close = function() {
			o.callback && o.callback.call($overlay[0]); // 执行回调函数
			$overlay.remove();
		};
		// 添加关闭btn
		$overlay.on("touchend", "[data-type='close']", dialog.close);
		return dialog;
	};
}(ui, typeof Zepto !== "undefined" ? Zepto : jQuery));

