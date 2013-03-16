//TestFlight_ATC
//
//TODO
//01:(MacOSのみ？)ダイアログが正常に出せないので代替え案考える

//データ格納用オブジェクト
var _strageData = {
    version: "",
    selected: "new",
    lists: {},

    getSelectedList: function()
    {
        return this.lists[this.selected];
    },

    setSelectedList: function(list)
    {
        this.lists[this.selected] = list;
    }
};

//初期化
$(function(){

    loadStrageData();

    //ウィンドウを閉じた時に保存
    window.onbeforeunload = saveStrageData;

    $("#savedLists").change(showList);
    $("#saveButton").click(save);
    $("#loadButton").click(load);

    showListName();
    showList();
});

//保存データ読み込み
function loadStrageData()
{
    //LocalStrage未保存ならば初期化
    if (!localStorage["version"]) {

        localStorage.clear();
        localStorage["version"] = chrome.runtime.getManifest().version;
        localStorage["selected"] = "new";
        localStorage["lists"] = "{}";
    }

    _strageData.version = localStorage["version"];
    _strageData.selected = localStorage["selected"];
    _strageData.lists = JSON.parse(localStorage["lists"]);
}

//データ保存
function saveStrageData()
{
    //localStorage["version"] = _strageData.version;
    localStorage["selected"] = _strageData.selected;
    localStorage["lists"] = JSON.stringify(_strageData.lists);
}

//一覧
function showListName()
{
    for(key in _strageData.lists){
        var isSelect = false;
        if (_strageData.selected == key) {
            isSelect = true;
        }
        addSavedLists(key, isSelect);
    }
}

//一覧表示
function showList()
{
    _strageData.selected = $("#savedLists").val();

    $("ol").remove();

    if (_strageData.selected == "new"){
        $("#loadButton").attr("disabled", "disabled");
        return;
    }else{
        $("#loadButton").removeAttr("disabled");
    }

    var ol = $("<ol type='1'></ol>").appendTo("body");
    $.each(_strageData.getSelectedList(), function(index, value){
        var q = $("<li></li>")
                .text(value)
                .appendTo(ol);
    }); 
}

//保存処理
function save()
{
    if (_strageData.selected == "new") {
        //新規の場合は名前を設定
        var listCount = Object.keys(_strageData.lists).length;
        //TODO:01
        //_strageData.selected = prompt("リスト名を入力してください", "list " + listCount+1);
        _strageData.selected = "list " + (listCount+1);
        //addSavedLists(_strageData.selected, true);
    }else{
        //上書きの場合は確認
        //TODO:01
        /*if (!confirm("上書きしますか?")) {
            return;
        };
        */
    }

    chrome.tabs.query({active: true}, function(tab){
        chrome.tabs.sendRequest(tab[0].id, {mode:"save"}, onSaveResponse);
    });
}

//保存メッセージ結果受信
function onSaveResponse(response)
{
    var retList = response;
    
    //リスト保存
    var list = new Array();
    $.each(retList, function(index, value){
        list[index] = value;
    });
    
    _strageData.setSelectedList(list);

    window.close();
}

//読込処理
function load()
{
    chrome.tabs.getSelected(null, function(tab){
        var sendParam =  {
            mode: "load",
            list: _strageData.getSelectedList()
        };
        chrome.tabs.sendRequest(tab.id, sendParam, function(){window.close();});
    });
}

//リスト追加
function addSavedLists(name, isSelect)
{
    var option = $("<option />", {value:name, text:name});

    if (isSelect) {
        _strageData.selected = name;
        option.attr("selected", "selected");
    }

    $("#savedLists").append(option);

    return option;
}
