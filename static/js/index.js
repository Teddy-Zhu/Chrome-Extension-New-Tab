/**
 * Created by teddy on 2015/5/15.
 */
/*------Cookie 存------*/
function setCookie(cookieName,value,expiresTime,path){
    if ( !expiresTime ) expiresTime = "Thu, 01-Jan-2030 00:00:01 GMT";
    if ( !path ) path = "/";
	$.cookie(cookieName, value, { path: path}); 
}
/*------Cookie 存------*/


var changeStr = '';   //初始化一个

function FillUrls() {
    //获取用户输入的关键字
    var strdomin = $("#search").val()

    //如果请求为空的话就不进行请求
    if (strdomin == null || strdomin == "") {
        $("#auto").empty();
        $("#auto").hide();
        return;
    }
    //跟上次请求的关键字相同就返回
    //    if (changeStr == strdomin)
    //        return;  

    changeStr = strdomin;
    window.status = "请求中";

    var qsData = { 'wd': strdomin, 'p': '3', 'cb': 'ShowDiv', 't': new Date().getMilliseconds().toString() };
    //发jsonp（跨域请求js）
    $.ajax({
        async: false,
        url: "http://suggestion.baidu.com/su",
        type: "GET",
        dataType: 'text',
        data: qsData,
        timeout: 5000,
        success: function (data) {
				var val = data.match(/,s:(.*)}\);/)[1]
				val = $.parseJSON('{"s":'+val+'}');
				ShowDiv(val);
        }
    });
}

function ShowDiv(strurls) {
    autoDisplay(strurls);
    window.status = "请求结束";
}

function autoDisplay(autoStr) {
    var Info = autoStr['s']   //拿到关键字提示

    var wordText = $("#search").val();
    var autoNode = $("#auto");   //缓存对象（弹出框）

    if (Info.length == 0) {
        autoNode.hide();
        return false;
    }

    autoNode.empty();  //清空上次
    for (var i = 0; i < Info.length; i++) {
        var wordNode = Info[i];   //弹出框里的每一条内容

        var newDivNode = $("<div>").attr("id", i);    //设置每个节点的id值
        newDivNode.attr("style", "font:14px/25px arial;height:25px;padding:0 8px;cursor: pointer;");

        newDivNode.html(wordNode).appendTo(autoNode);  //追加到弹出框

        //鼠标移入高亮，移开不高亮
        newDivNode.mouseover(function () {
            if (highlightindex != -1) {        //原来高亮的节点要取消高亮（是-1就不需要了）
                autoNode.children("div").eq(highlightindex).removeClass("highlight");
            }
            //记录新的高亮节点索引
            highlightindex = $(this).attr("id");
            $(this).addClass("highlight");
        });
        newDivNode.mouseout(function () {
            $(this).removeClass("highlight");
        });

        //鼠标点击文字上屏
        newDivNode.click(function () {
            //取出高亮节点的文本内容
            var comText = autoNode.hide().children("div").eq(highlightindex).text();
            highlightindex = -1;
            //文本框中的内容变成高亮节点的内容
            $("#search").val(comText);
        })
        if (Info.length > 0) {    //如果返回值有内容就显示出来
            autoNode.show();
        } else {
            autoNode.hide();
            highlightindex = -1;
        }

    }

}

var timeoutId;   //延迟请求服务器
var highlightindex = -1;   //高亮

/*-----------ISURL START-----------*/
function IsURL(a) {
    var b = "^((https|http|ftp|rtsp|mms)?://)" + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + "(([0-9]{1,3}.){3}[0-9]{1,3}" + "|" + "([0-9a-z_!~*'()-]+.)*" + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." + "[a-z]{2,6})" + "(:[0-9]{1,4})?" + "((/?)|" + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    var c = new RegExp(b);
    return !!c.test(a);
}
/*-----------ISURL END-----------*/

/*-----------GETICO START-----------*/
function getico(a) {
	a= a == null || a == 'null' ? undefined : a;
	if(a){
	    var s = a.indexOf("//");
		temp = a.substring(s + 2);
		var b = temp.indexOf("/");
		if (b == -1) {
			b = temp.length;
		}
		return a.substring(0, b + s + 2) + "/favicon.ico";
	}else{
		return a;
	}

}
/*-----------GETICO END-----------*/


$(function(){
    $("#search").keyup(function (event) {
        var myEvent = event || window.event;
        var keyCode = myEvent.keyCode;    //键值 不同的值代表不同的键  13是回车等
        //console.log(keyCode);

        //只有按键盘的字母键、退格、删除、空格、ESC等键才进行响应：8退格backspace 46删除delete 空格32
        if (keyCode >= 65 && keyCode <= 90 || keyCode >= 48 && keyCode <= 57 || keyCode >= 96 && keyCode <= 111 || keyCode >= 186 && keyCode <= 222 || keyCode == 8 || keyCode == 46 || keyCode == 32 || keyCode == 13) {
            //代码节流,but百度的
            //                    clearTimeout(timeoutId);
            //                    timeoutId = setTimeout(function () {
            //                        timeoutId = FillUrls();
            //                    }, 500)
            FillUrls();
            if (highlightindex != -1) {
                highlightindex = -1;
                //autoNodes.eq(highlightindex).css("background-color", "white");
            }
        }

        else if (keyCode == 38 || keyCode == 40) {
            if (keyCode == 38) {       //向上
                var autoNodes = $("#auto").children("div")
                if (highlightindex != -1) {
                    //如果原来存在高亮节点，则将背景色改称白色
                    autoNodes.eq(highlightindex).removeClass("highlight");
                    highlightindex--;
                } else {
                    highlightindex = autoNodes.length - 1;
                }
                if (highlightindex == -1) {
                    //如果修改索引值以后index变成-1，则将索引值指向最后一个元素
                    highlightindex = autoNodes.length - 1;
                }
                //让现在高亮的内容变成红色
                autoNodes.eq(highlightindex).addClass("highlight");

                //取出当前选中的项 赋值到输入框内
                var comText = autoNodes.eq(highlightindex).text();
                $("#search").val(comText);
            }
            if (keyCode == 40) {    //向下
                var autoNodes = $("#auto").children("div")
                if (highlightindex != -1) {
                    //如果原来存在高亮节点，则将背景色改称白色
                    autoNodes.eq(highlightindex).removeClass("highlight");
                }
                highlightindex++;
                if (highlightindex == autoNodes.length) {
                    //如果修改索引值以后index变成-1，则将索引值指向最后一个元素
                    highlightindex = 0;
                }
                //让现在高亮的内容变成红色
                autoNodes.eq(highlightindex).addClass("highlight");

                var comText = autoNodes.eq(highlightindex).text();
                $("#search").val(comText);
            }
        } else if (keyCode == 13) {     //回车
            //下拉框有高亮内容
            if (highlightindex != -1) {
                //取出高亮节点的文本内容
                var comText = $("#auto").hide().children("div").eq(highlightindex).text();
                highlightindex = -1;
                //文本框中的内容变成高亮节点的内容
                $("#search").val(comText);
            } else {
                //下拉框没有高亮内容
                $("#auto").hide();

                //已经提交，让文本框失去焦点（再点提交或者按回车就不会触发keyup事件了）
                $("#search").get(0).blur();
            }
        } else if (keyCode == 27) {    //按下Esc 隐藏弹出层
            if ($("#auto").is(":visible")) {
                $("#auto").hide();
            }
        }
    });

    //点击页面隐藏自动补全提示框
    document.onclick = function (e) {
        var e = e ? e : window.event;
        var tar = e.srcElement || e.target;
        if (tar.id != "search") {
            if ($("#auto").is(":visible")) {
                $("#auto").css("display", "none")
            }
        }
    }
    if ("FLASE" != $.cookie("FIRSTTIME")) {
        setCookie("71", "http://www.google.com");
        setCookie("81", "http://www.qq.com");
        setCookie("84", "http://www.taobao.com");
        setCookie("86", "http://www.v2ex.com");
        setCookie("87", "http://www.weibo.com");
        setCookie("89", "http://www.youku.com");
        setCookie("FIRSTTIME", "FLASE");
    }


    for (var i = 48; i < 91; i++) {
        var u = $.cookie(""+i);
		var url = getico(u);
		if(url){
			$("#"+i).parent().append("<img class='fav' src='"+ getico(u) +"'>");
		}
    }
    var _search = $("#search");
    $(document).keydown(function(event){
        var keyCode = event.which;
        if (_search.is(":focus")){
            if (keyCode == 9){
                window.event.returnValue = false;
                _search.blur();
            }
            if (keyCode == 229){
                $(document).keyup(function(event){
                    keyCode = event.which;
                    $("#"+keyCode).addClass('keyDownLi');
                    $("#"+keyCode).parent().addClass('keyDownSpan');
                    setTimeout(function(){
						$('#'+keyCode).removeClass('keyDownLi');
					},80);
                    setTimeout(function(){
						$('#'+keyCode).parent().removeClass('keyDownSpan');
					},80);
                });
            }
        }
        $("#"+keyCode).addClass('keyDownLi');
        $("#"+keyCode).parent().addClass('keyDownSpan');
    });

    $(document).keyup(function(event){
        var keyCode = event.which;
        $("#"+keyCode).removeClass('keyDownLi');
        $("#"+keyCode).parent().removeClass('keyDownSpan');
        if (keyCode == 9 || event.ctrlKey || _search.is(":focus")){
            window.event.returnValue = false;
            return false;
        }else{
            var u = $.cookie(''+keyCode);
            u && ( window.open(u) );
        }
    });

    $("#keyboard ul span").mouseenter(function(){
        $(this).append("<div class='keySetting'><img id='deleteImg' class='deleteImg' src='/static/img/delete.png'><img id='settingImg' class='settingImg' src='/static/img/setting.png'></div>");
        $("#settingImg").click(function(){
            var key = $(this).parent().siblings('li').attr("id");
            var u = prompt("请输入按键 ['"+$(this).parent().siblings('li').text()+"'] 对应的网址：\n(不以http://、ftp://等开头的网址将自动填充http://)", $.cookie(key) || "www.example.com");
            if (u && !RegExp("^((https|http|ftp|rtsp|mms)?://)").test(u)) {
                u = "http://" + u;
            }
            if (IsURL(u)) {
                setCookie(key, u);
                $(this).parent().siblings('.fav').remove();
				var url = getico(u);
				if(url){
					$(this).parent().parent().append("<img class='fav' src='"+ getico(u) +"'>");
				}
            }else{
                u && alert("网站地址输入错误!请核对");
            }
        });
        $("#deleteImg").click(function(){
            var key = $(this).parent().siblings('li').attr("id");
            setCookie(key, '');
            $(this).parent().siblings('.fav').remove();
        });
        $(".keySetting").fadeTo(500, 0.9);
    });

    $("#keyboard ul span").mouseleave(function(){
		$(this).children('.keySetting').remove();
    });

    $("#keyboard ul span li").click(function(){
        var key = $(this).attr("id");
        var u = $.cookie(key);
		u = u == null || u== "null" ? undefined : u ;
        u && ( window.open(u) );
    });
});
