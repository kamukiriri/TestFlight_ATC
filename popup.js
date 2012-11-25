var list;

//初期化
$(function(){
    $("#saveButton").click(save);
    $("#loadButton").click(load);
    
    showList();
});

function showList(){
    list = new Array();
    $.each(localStorage, function(index, value){
        var q = $("<div></div>")
                .text(value)
                .appendTo("body");
        
        list.push(value);
    }); 
}

//保存処理
function save()
{
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendRequest(tab.id, {mode:"save"}, onResponse);
    });
}

//結果メッセージ受信
function onResponse(response){
    var retList = response;
    
    //リスト保存
    localStorage.clear();
    $.each(retList, function(index, value){
        localStorage[index] = value;
    });

    window.close();
}

//読込処理
function load()
{
    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.sendRequest(tab.id, {mode:"load", list:list}, function(){window.close();});
    });
}
