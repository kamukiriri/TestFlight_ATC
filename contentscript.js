//初期化
$(function(){
    chrome.extension.onRequest.addListener(onRequest);
});

//メッセージ受信
function onRequest(request, sender, sendResponse){

    if(request.mode == "save"){
        var list = getList();
        sendResponse(list);
    }else if(request.mode == "load"){
        setList(request.list);
        sendResponse({});
    }
}

//チェック一覧取ってくる
function getList(){
    var retList = new Array();
    $("table", $(".contain"))
    .each(function(){
        var tbl = $(this);
        var tds = $("input:checked", tbl);
        tds.each(function(){
            var chk = $(this);
            var lbl = $("label[for=" + chk.val() + "]", tbl);
            if(lbl.length == 0){
                lbl = $("label[for=tester_" + chk.val() + "]", tbl);
            }
            retList.push(lbl.text());
        });
    });
    
    return retList;
}

//チェックを付ける
function setList(list){
    $("table", $(".contain"))
    .each(function(){
        var tbl = $(this);
        var lbls = $("label", tbl);
        lbls.each(function(){
            var lbl = $(this);
            if(jQuery.inArray(lbl.text(), list) == -1){
                return true;
            }
            var chk = $("input[value=" + lbl.attr("for").replace("tester_","") + "]", tbl);
            chk.attr("checked", "checked");
            console.log(lbl.text());
        });
    });
}
