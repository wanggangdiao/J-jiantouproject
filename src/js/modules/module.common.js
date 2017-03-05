define('modules/module.common', function(require, exports, module) {
    "use strict";
    
	var $ = ('undefined' == typeof window.jQuery ? require('jquery') : window.jQuery);
    var $window = $(window), $document = $(document);
    var fnGlobalUrl = require[require.toUrl ? 'toUrl' : 'resolve'];
    
	var __layer = window.layer = require('layer.mobile');
	var __layerCss = 'library/dist/layer_mobile/need/layer.css';
	window.layer = __layer;
	if (fnGlobalUrl) {
		__layerCss = fnGlobalUrl(__layerCss);
		__layerCss = '<link href="'+ __layerCss +'" rel="stylesheet" type="text/css" id="layermcss">';
		if ($('base')[0]) {
			$('base').before(__layerCss);
		} else {
			$('head').append(__layerCss);
		}
	}
	
    /* ============================================================
     * 前台页面基础类（basePage）
     * ============================================================ */
    var m_basePage = window.basePage = {
        createNew: function() {
            var $internal = {};
            $internal.wW = parseInt($window.width());
            $internal.wH = parseInt($window.height());
            
            return $internal;
        }
    };
    window.basePage = m_basePage;
    module.exports = {
        run: function() {
			/* ============================================================
			 * Global MUI Initialization
			 * ============================================================ */
			/*
			var a = document.getElementsByTagName('a');
			for (var i = 0; i < a.length; i++) {
				a[i].addEventListener('touchstart', function(){}, false);
			}
			*/
			mui.init({
				swipeBack: true
			});
			mui.ready(function() {});
			
            return;
        }
    };
    
});