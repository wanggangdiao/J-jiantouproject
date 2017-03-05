define(function(require, exports, module) {
    
    window.$ = window.jQuery = require('jquery');
    window.L = require('{LIB}/lodash') || {};
		window.mui = require('mui') || {};
			
    /* ************************************************************ */
    /* 配置模块接口，并导入指定的控制模块 */
    exports.baseToString = function(value) {
        return value == null ? '' : (value + '');
    };
    exports.load = function(named) {
        named = exports.baseToString(named);
        if (!L.isString(named)) {
            return;
        } else {
            if (L.isEmpty(named)) {
                return;
            }
        }
        
        require.async('LMODULES/'+ named +'.js?' + window.$app.version, function(controller) {
            if (L.isObject(controller) && L.has(controller, "run")) {
                controller.run();
            }
        });
    };
    exports.loadScript = function(scripts) {
        $.each(scripts, function(n, value) {
            if (!L.isEmpty(value)) {
                exports.load(value);
            }
        });
    };
    window.$app.load = exports.load;
    
	/* 提前加载指定的模块 */
    if (L.isArray($app.preferred)) {
        exports.loadScript($app.preferred);
    } else {
        $app.preferred = L.trim(exports.baseToString($app.preferred));
        exports.load($app.preferred);
    }
    
	/* 加载控制器 */
    $app.controller = exports.baseToString($app.controller);
    if (!L.isEmpty($app.controller)) {
        exports.load($app.controller);
    }
    
	/* 延后加载指定的模块 */
    if (L.isArray($app.delayed)) {
        exports.loadScript($app.delayed);
    } else {
        $app.delayed = L.trim(exports.baseToString($app.delayed));
        exports.load($app.delayed);
    }
    
    try {
        if (window.console && window.console.log) {
            console.log("若将岚海称之为舞台，那未免太过于俗气；\n若将岚海比做是家庭，那又明显缺乏创意。\n对于那些从千军万马中脱颖而出的岚海人来说，\n他们选择的不是一份工作，而是一种生活方式。\n请做好一切心理准备，接触岚海，将可能导致你焕然一新！\n");
            console.log("请将简历发送至 %c hr@lhave.com（ 邮件标题请以“姓名-应聘XX职位-来自console”命名）", "color:red");
            console.log("职位介绍：http://www.lhave.com/job/");
        }
    } catch (ex) {
    };
	
});