//ダイアログ表示プラグインもどき

$.extend(new function(){
	var self = this;

	//ダイアログの共通処理
	var _dialogComponent = function(msgJqObj, btnsJqObj){
		this.setMessage = function(message){
			msgJqObj.text(message);
		};

		this.getMessage = function(){
			return msgJqObj.text();
		};

		this.addElement = function(element){
			btnsJqObj.before(element);
		};

		this.addButton = function(text, onClickHandler){
			var button = $("<button>")
							.text(text)
							.css({
								// display: "block"
								//,margin: "10px auto 0px auto "
							})
							.appendTo(btnsJqObj);
			button.click(onClickHandler);

			//return button;
		};
	};

	//ベースとなるダイアログ要素を作成
	function _createDialogBase() {		
		var dialog = $("<div>")
						.addClass("jq-dialog")
						.css({
							 "background-color": self.dialogBackgroundColor
							,margin: "10px auto auto auto"
							,padding: "10px 10px 10px 10px"
							,"width": 200
							,"max-width": "90%"
						});
		
		var messageBox = $("<div>")
						.css({
							 margin: "0px 0px 10px 0px"
							,"text-align": "center"
						})
						.appendTo(dialog);

		var buttonContainer = $("<div>")
								.css({
									 width: "100%"
									,padding: "0 0 0 0"
									,margin: "10px auto 0px auto"
									,"text-align": "center"
								})
								.appendTo(dialog);

		dialog.extend(new _dialogComponent(messageBox, buttonContainer));

		return dialog;
	}

	//要素をモーダル表示
	function _showModal(element){
		var lockScreen = $("#lockScreen");
		if (lockScreen.length == 0) {
			lockScreen = $("<div>", {id: "lockScreen"})
							.css({
								 top: 0
								,left: 0
								,width: "100%"
								,height: "100%"
								,margin: "0px 0px 0px 0px"
								,"background-color": "rgba(0,0,0,0.4)"
								,position: "absolute"
								,"z-index": 9999
							})
							.appendTo("body")
		}

		element.appendTo(lockScreen);
	}

	//ダイアログ要素
	function _showDialog(styles, initializer){		
		var dialog = _createDialogBase();
		
		initializer(dialog);
		if (styles) {
			dialog.css(styles);
		}
		$("button", dialog).click(_close);

		_showModal(dialog);
	}

	//モーダル表示を閉じる
	function _close(){
		$(this).parent().parent().remove();

		var lockScreen = $("#lockScreen").eq(0);
		if (lockScreen.length != 0){
			if (lockScreen.children().length == 0) {
				lockScreen.remove();
			}
		}
	}

	this.dialogBackgroundColor = "#f0f0f0";

	this.showAlert = function(message, onCloseHandler, styles){
		_showDialog(styles, function(dialog){
			dialog.setMessage(message);
			dialog.addButton("OK", onCloseHandler);
		});
	};

	this.showConfirm = function(message, onCloseHandler, styles){
		if (typeof onCloseHandler === "undefined"){
			onCloseHandler = function(){};
		}

		_showDialog(styles, function(dialog){
			dialog.setMessage(message);
			dialog.addButton("OK", function(){
				onCloseHandler(true);
			});
			dialog.addButton("Cancel", function(){
				onCloseHandler(false);
			});
		});
	};

	this.showPrompt = function(message, defaultText, onCloseHandler, styles){
		if (typeof onCloseHandler === "undefined"){
			onCloseHandler = function(){};
		}

		_showDialog(styles, function(dialog){
			dialog.setMessage(message);

			var textBox = $("<input type='text'>")
							.css({
								width: "100%"
							})
							.val(defaultText);
			dialog.addElement(textBox);

			dialog.addButton("OK", function(){
				onCloseHandler(textBox.val());
			});
			dialog.addButton("Cancel", function(){
				onCloseHandler(false);
			});
		});
	};

}());