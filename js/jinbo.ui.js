/*
 * Mobile UI - v1.0 - 2015-03-03
 * https://github.com/qiangspecial/mobile.ui
 *
 * Copyright (c) 2015 Jinbo 
 *
 * Mail: qiangspecial@qq.com
 */

var ui = ui || {};


/**
 * 弹出弹窗插件
 * 调用方法: ui.dialog(o);
 * o: {}
 */
(function(ui, $) {
	var _option = {
		content: "",			// String   弹出弹窗的内容
		data: {
			title: "财宝宝提示：",
			text: "...",
			btn: [{
				text: "确认",
				"data-type": "close",
				id: "btn1"
			}, {
				text: "取消",
				"data-type": "close",
				id: "btn2"
			}]
		},				// String	弹出弹窗的文案
		needOverlay: true,		// Boolean  是否添加遮罩层
		autoClose: 0,			// Number   自动关闭弹出窗时间,0为不自动关闭
		afterInit: null,
		callback: null			// Function 关闭弹出层执行的回调函数
	},
	// 获取默认的content
	_getDefaultContent = function(title) {
		return '<div class="ui-dialog ui-center">' +
			(title ? '<h4 class="ui-dialog-title">{{title}}</h4>' : '') +
			'<p class="text-center fz14">{{text}}</p>' +
			'<div class="ui-btn-group mgt15">{{btnContent}}</div>' +
			'</div>';
	};
	// 默认的btnContent
	// _defaultBtnContent = '<a href="javascript:;" class="ui-btn" data-type="close">确认</a><a href="javascript:;" class="ui-btn" data-type="close">取消</a>';
	
	/* Simple Template */
	var _tpl = function(data, content) {

		return content.replace(/\{\{(.*?)\}\}/g, function($, $1) {
			return data[$1];
		});
	};


	function Dialog(o) {
		// 设置参数
		this.o = $.extend({}, _option, o);
		this.init();
	}

	Dialog.prototype = {
		constructor: Dialog,

		_hasOverlay: function() {
			return !!$("#ui-overlay").length;
		},

		/* 获取弹出蒙版 */
		_initOverlay: function(needOverlay) {
			var $overlay = $("#ui-overlay"),
				// 判断是否需要遮罩层(遮罩始终存在,只是显示为 灰色/透明 之分)
				overlayContent = '<div id="ui-overlay" class="' + (needOverlay ? 'ui-overlay ' : '') + 'ui-fixed-center"></div>';

			// 删除原有的弹出框
			if ($overlay[0]) $overlay.remove();
			return $(overlayContent);
		},

		/**
		 * 获取弹窗html
		 * @param  {Object} data    要填充的数据
		 * @param  {String} content 模板, 里面的 {{}} 为动态填充的数据
		 * @return {String}         弹窗
		 */
		_initContent: function(data, content) {
			var _this = this;

			// content为空则取默认content, 分有title和无title类型
			if (!content) content = _getDefaultContent(data.title);
			data.btnContent = data.btnContent || _this._getBtnGroupContent(data.btn);

			return _tpl(data, content);
		},

		/* 获取 btnGroupContent */
		_getBtnGroupContent: function(btn) {
			var btnGroup,
				btnGroupContent = "";

			// 将btn转成 [{text: ""}] 格式, 存入 btnGroup
			switch ($.type(btn)) {
				case "undefined": 
					btnGroup = [{
						text: "确认",
						"data-type": "close"
					}, {
						text: "取消",
						"data-type": "close"
					}];
					break;
				case "string": 
					btnGroup = [{
						text: btn,
						"data-type": "close"
					}];
					break;
				case "object":
					btnGroup = [btn];
					break;
				case "array":
					btnGroup = btn;
					break;
				default: 
					throw new Error("非法的 btn");
			}

			// 拼装 btnGroupContent
			btnGroup.forEach(function(data) {
				var contents = ['<a href="javascript:;"'],
					i;

				data.class = data.class || "ui-btn";
				for (i in data) {
					if (i != "text") contents.push(i + '="' + data[i] + '"');
				}
				contents.push('>' + data.text + '</a>');

				btnGroupContent += contents.join(" ");
			});

			this.o._btnGroup = btnGroup;
			return btnGroupContent;
		},

		close: function() {
			var _this = this,
				o = _this.o,
				$overlay = _this.$;

			if (o.callback) o.callback.call($overlay[0]); // 执行回调函数
			$overlay.addClass("fadeOut");

			// TODO
			$overlay.on("webkitAnimationEnd", function() {
				$overlay.remove();
			});
		},

		/* 绑定事件 */
		onEvent: function() {
			var _this = this;

			_this.$.on("touchend", "[data-type='close']", function() {
				_this.close();
			});
		},

		/* 自动关闭dialog */
		autoClose: function(time) {
			var _this = this;

			_this._autoCloseTimer = setTimeout(function() {
				_this.close();
			}, time || _this.o.autoClose);
		},

		/* 停止自动关闭 */
		stopAutoClose: function() {
			clearTimeout(this._autoCloseTimer);
		},

		/* 初始化 */
		init: function() {
			var _this = this,
				o = _this.o,
				content = _this._initContent(o.data, o.content),
				$overlay = _this._initOverlay(o.needOverlay);

			$("body").append($overlay.html(content));
			_this.$ = $overlay.show(200);		
			_this.onEvent();
			if (_this.afterInit) _this.afterInit.call($overlay);
			if (o.autoClose) _this.autoClose(o.autoClose);
		}
	};

	// 弹窗
	ui.dialog = function(o) {
		return new Dialog(o);
	};

	// 提示弹窗
	ui.message = function(text, callback) {
		return new Dialog({
			content: '<div class="ui-sm-dialog ui-center">{{text}}</div>',
			data: {
				text: text
			},
			needOverlay: false,
			autoClose: 3000,
			callback: callback
		});
	};

	// 错误弹窗
	ui.error = function(text, callback) {
		return new Dialog({
			content: '<div class="ui-sm-dialog ui-center">{{text}}</div>',
			data: {
				text: text
			},
			needOverlay: false,
			autoClose: 3000,
			callback: callback
		});
	};

	// loading
	ui.loading = function(text) {
		return new Dialog({
			content: '<div class="ui-fullloading ui-sm-dialog ui-center text-center"><span class="ui-loading"></span>{{text}}</div>',
			data: {
				text: text || "加载中"
			}
		});
	};
	// small loading
	ui.smLoading = function(text) {
		return new Dialog({
			content: '<div class="ui-sm-loading ui-sm-dialog ui-center">{{text}}</div>',
			data: {
				text: text || "加载中"
			}
		});
	};
}(ui, typeof Zepto !== "undefined" ? Zepto : jQuery));