/*
* @Author: Administrator
* @Date:   2017-12-06 23:06:36
* @Last Modified by:   Administrator
* @Last Modified time: 2017-12-07 00:00:24
*/
define(function(){
    return {
        mapExecFunction: function(dataArr, func){
            var outerArgs = Array.prototype.slice.call(arguments, 2);
            dataArr.map(function(val){
                func.apply(null, [val].concat(outerArgs));
            });
        }
    }
});