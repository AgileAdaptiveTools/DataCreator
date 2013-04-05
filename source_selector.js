//generates the "Add" button used as part of the Source Selector
//Currently unused
/*
var generateSourceAddButton = function(sourceNum){
	var button = Ext.create('Ext.button.Button', {
		id: 'source_add_button'+sourceNum,
		class: 'add_button',
		text: 'Add',
		//height: 20,
		width: 50,
		handler: function(){ 
			executeAddButton(sourceNum);
		},
	});
	return button;
};
*/

//generates the "Add" button for a Source Panel
var generateSourceAddButtonPanel = function(sourceNum){
	//var button = generateSourceAddButton(sourceNum);
	var panel = Ext.create('Ext.Panel', {
		id: "add_button_panel"+sourceNum,
		layout: {
			type: 'hbox',
			align: 'stretch',
		},
		height: 25, 
		border: false,
		defaults: { border: false,},
		items: [
			{html:"", flex:1},
			{html:"Blank", bodyStyle: "color: #FFF;", flex:1},
			{html:"", flex:1},
		],
	});
	return panel;
}

var generateSourceRemoveButton = function(sourceNum){
	var button = Ext.create('Ext.button.Button', {
		id: 'source_remove_button'+sourceNum,
		class: 'remove_button',
		text: 'Remove',
		height: 20,
		width: 50,
		handler: function(){ 
			executeRemoveButton(sourceNum);
		}
	});
	return button;
};

//generates the "Remove" button for a Source Panel
var generateSourceRemoveButtonPanel = function(sourceNum){
	var button = generateSourceRemoveButton(sourceNum);
	var panel = Ext.create('Ext.Panel', {
		id: "remove_button_panel"+sourceNum,
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
		height: 25, 
		border: false,
		defaults: { border: false},
		items: [
			{html:"", flex:1},
			button,
			{html:"", flex:1}
		]
	});
	console.log("Generated button: ", button);
	//panel.hide();
	return panel;
}

function generateSourceSelector(sourceNumber){ 
    var fileForm = Ext.create('Ext.form.Panel', {
    		id: "fileForm"+sourceNumber,
			flex: 1,
			bodyStyle: 'padding: 10px;',
			//border: false,
	
			defaults: {
				anchor: '100%',
				allowBlank: false,
				msgTarget: 'side',
				labelWidth: 50
			},
	
			items: [
			{html: "<div class='sourcePanel'>My Computer</div>", bodyStyle: "background: #DFE9F6; border: 0px;",},
			{
				xtype: 'filefield',
				id: 'inputFile'+sourceNumber,
				emptyText: 'Select a CSV file',
				name: 'inputFile',
				buttonText: 'Browse',
				listeners: {
					change: function(t, fileLocation) {
						console.log("file changed!");
					}
				}

			}],
	
			/*
			buttons: [{
				text: 'Upload',
				handler: function(){
					var form = this.up('form').getForm();
					if(form.isValid()){
						form.submit({
							//url: '/DataEngine/csvSlurper/',
							url: 'https://localhost:8443/DataEngine/csvSlurper/',
							force_mime_type: "text/plain",  
							waitMsg: 'Uploading your file...',
							success: function(fp, o) {
								msg('Success', 'Processed file "' + o.result.file + '" on the server');
							},
							failure: function (form, o) {
								Ext.Msg.show({
									title: 'Add Request Failed',
									msg: o.result.error,
									buttons: Ext.Msg.OK,
									icon: Ext.Msg.ERROR
								});
							}
						});
					}
				}
			}]
			*/
		});
    
    var urlButton = Ext.create('Ext.button.Button', {
		id: 'source_add_button'+sourceNumber,
		class: 'add_button',
		text: 'Add',
		bodyStyle: 'padding: 10px;',
		//height: 20,
		width: 50,
		handler: function(){ 
			executeAddButton(sourceNumber);
		},
	});
    
    var urlForm = new Ext.form.FormPanel({
      //flex: 1,
      border: false,
      //layout: 'fit',
	  bodyStyle: 'padding: 10px;',
      items: [
      	 {html: "<div class='sourcePanel'>Web Address</div>", bodyStyle: "background: #DFE9F6; border: 0px;",},
         new Ext.form.TextField({
         	 xtype: 'textfield',
			id:'urlInput'+sourceNumber,
			name: 'urlInput'+sourceNumber,
			label: "Web Address",
			hideLabel: 'true',
			//height: 40,
			//width: 280,
		}),
      ],
      buttons: [urlButton],
      listeners: {
      	boxready: function(t, width, height) {
      		var textField = Ext.get('urlInput'+sourceNumber);
      		var firstWidth = t.getWidth();
      		textField.setWidth(firstWidth - 30);
      	},
      	resize: function(t, width, height, oldWidth, oldHeight, eOpts ) {
      		var textField = Ext.get('urlInput'+sourceNumber);
      		textFieldOldWidth = textField.getWidth();
      		textField.setWidth(textFieldOldWidth + (width - oldWidth));
      	}
      }
   });
    
    var urlPanel = Ext.create('Ext.Panel', {
    	id: "urlPanel"+sourceNumber,
    	flex: 1,
    	layout: 'fit',
    	border: true,
    	items: [urlForm],
    });
    
    var dragForm = new Ext.form.FormPanel({	
		flex: 1,
		height: 200,
		bodyStyle: 'padding: 10px;',
      	//border: false,
      	items: [
      		 {html: "<div class='sourcePanel'>Drag and Drop<br/><br/><img src='resources/images/drophere.png'/></div>", bodyStyle: "border-width:0px;"},
      		 
         ]
     });
     
    var source_choice = Ext.create('Ext.Panel', {
    	id: "source_choice"+sourceNumber,
    	layout: {
    		type: 'hbox',
    		align: 'stretch',
    	},
    	border: false,
    	height: 240,
    	defaults: {
    		cls: 'round-corners'
    	},
    	items: [
    		{html: "", width: 40, border: false},
    		dragForm,
    		{html: "<!-- <HR width=1, size=150/> -->", width: 20, border: false},
			fileForm,
			{html: "<!-- <HR width=1, size=150/> -->", width: 20, border: false},
			urlPanel,
			{html: "", width: 40, border: false},
		
    	],
    });
    
    
    var removeButtonPanel = generateSourceRemoveButtonPanel(sourceNumber);
    //console.log("RemoveButtonPanel = ", removeButtonPanel);
    
    var source_info = Ext.create('Ext.Panel', {
		 title: "Source Successfully Added", 
		 id: "sourceInfo"+sourceNumber, 
		 defaults: {border: false},
		 layout: { 
		 	type: 'vbox',
		 	align: 'stretch'
		 },
		 items: [{html: "<div id='continue"+sourceNumber+"' class='continuePanel'></div>", flex:1}, removeButtonPanel],
		 flex:2    
    });
    
	var source_continue = Ext.create('Ext.Panel', { 
		id: 'source_continue'+sourceNumber,
		border: false,
		//title: "Source Information",
		height:240,
		layout: "hbox",
		items: [{html: "", border: false, flex:1},
				source_info,
				{html: "", border: false, flex:1}],
	});
	//console.log("sourceInfo: ", Ext.getCmp("sourceInfo"+sourceNumber));
	Ext.getCmp("source_continue"+sourceNumber).hide();
    
    
    var numberWord;
    if (sourceNumber == 1){
    	numberWord = "first";
    }
    else {
    	numberWord = "second";
    }
    //var source_banner = generateBannerPanel("Select Data Source "+sourceNumber, "Select your first "+numberWord+" by dragging it from your saved sources on the left, enter the URL for it below or browse for it.");
    var source_banner = {html: "<img class='centered' src='resources/images/selectDS"+sourceNumber+".png'/>"}
    
    //var source_add_button_panel = generateSourceAddButtonPanel(sourceNumber);
    //var source_remove_button_panel = generateSourceRemoveButtonPanel(sourceNumber);
    
    var source_selector = Ext.create('Ext.Panel', {
		id: "source_selector"+sourceNumber,
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		defaults: {
			border: false,
		},
		border: false,
		items: [
				//{id: 'progress1', html: "<div class='progressPanel'><center><b>Data Source 1</b> -> Data Source 2 -> Data Output -> Save</center></div>", height: 50},     
				{html: "<div class='progressPanel'><img class='centered' src='resources/images/step"+sourceNumber+"a.png'/></div>", height: 95},
				//{html: "<hr width='95%'/>", height: 20},
				source_banner,
				source_choice, 
				//{html: "", height: 15},
				//{html: "<hr style='vertical-align:middle;' width='85%'/>", height: 10},
				//{html: "", height: 15},
				source_continue,
				//source_add_button_panel,
				//source_remove_button_panel,
				],
	});
	return source_selector;
};

/*
var check = Ext.create('Ext.panel.Panel', {
							id: "check",
							width: 128,
							height: 128,
							floating: true,
							border: false, 
							shadow: false,
							bodyStyle: "background: transparent;",
							html: "<img src='resources/images/check.png'/>"
});
*/

var executeRemoveButton = function(sourceNum){
	//blankTemplate.overwrite("continue"+sourceNum, {});
	Ext.getCmp("source_choice"+sourceNum).show();
	//Ext.getCmp('add_button_panel'+sourceNum).show();
	//Ext.getCmp('remove_button_panel'+sourceNum).hide();
	//Ext.getCmp("main_next").setDisabled(true);
	//Ext.getCmp("main_next").setSrc("resources/images/button_next_disabled.png");
	disableButton("next", true);
	//check.hide();
	if (sourceNum == 1){
			var last_item = source_attribute1.items.items.pop();
			console.log("Destroying: ", last_item);
			last_item.destroy();
			disableButton("next", false);
	}
	if (sourceNum == 2){
			var last_item = source_attribute2.items.items.pop();
			console.log("Destroying: ", last_item);
			last_item.destroy();
			disableButton("next", false);
	}
	
	
	
	Ext.getCmp("source_continue"+sourceNum).hide();
}


//called when the Add button is clicked
var executeAddButton = function(sourceNum){
	var urlInput = Ext.getCmp("urlInput"+sourceNum);
	
	if (urlInput.value){
		//console.log("Found URL, proceeding");
		var urlValue =  urlInput.value;
		if (sourceNum == 1){
			sourceURL1 = urlValue;
		}
		else {
			sourceURL2 = urlValue;
		}
		if (urlValue == "data"+sourceNum+".csv" || urlValue == "undefined") {
			urlInput = DOMAIN+"/DataEngine/csvSlurper?url="+DOMAIN+ROOT+"/data"+sourceNum+".csv";
		}
		else {
			if (urlValue.slice(-3) == "csv"){
				urlInput = DOMAIN+"/DataEngine/"+CSVSLURPER+"?url="+urlValue;
			}
			else{
				urlInput = DOMAIN+"/DataEngine/"+JSONSLURPER+"?url="+urlValue;
			}
		}
		Ext.Ajax.request({
		   method: "GET",
		   url: urlInput, 
		   //success: slurperPass,   
		   //failure: slurperFail,
		   //jsonData: { foo: 'bar' }  // your json data
		   params: { format: 'json' },
		   callback: function(original, successBool, response){
				//console.log("ResponseText: ", response.responseText);
				var jsonResponse = JSON.parse(response.responseText);
				//console.log(jsonResponse);
				
				var keys = Object.keys(jsonResponse.feed.records[0].ext);
				if (sourceNum == 1){
					global_keys1 = keys;
				}
				else {
					global_keys2 = keys;
				}
				//console.log("Data"+sourceNum+"'s keys: ", keys);
				Ext.define("Data"+sourceNum,{
					extend: 'Ext.data.Model',
					fields: keys,
				});
							
				//console.log("Data"+sourceNum+"'s data: ", jsonResponse);				
				var new_store = Ext.create('Ext.data.Store', {
					id: "data_store"+sourceNum+"",
					model: "Data"+sourceNum,
					autoLoad: true,
					data: jsonResponse.feed,
					proxy: {
						type: 'memory',
						reader: {
							type: 'json',
							root: 'records',
							record: 'ext',
						}
					}
				});
				
				new_store.load({
					callback: function(records, operation, success) {
					//console.log("Objects in store: ", new_store.getCount());
					if(success){
						//console.log("Source "+sourceNum+": Success!");
						//console.log("Records: ", records);
						//console.log("Name: ", jsonResponse.title); 
						var title = jsonResponse.title;
						if (title == null){
							title = "Source "+sourceNum;
						}
						var type = jsonResponse.description;
						if (type == null){
							type = "Undefined";
						}
						if (sourceNum == 1){
							global_store = new_store;
						}
						else {
							global_store2 = new_store;
						}
						//var msg = sourceTemplate.applyTemplate({name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});
						/*
						Ext.Msg.show({
							title: 'Source Request Succeeded',
							msg: msg,
							buttons: Ext.Msg.OK,
						});
						*/
						sourceTemplate.overwrite("continue"+sourceNum, {name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});
						//continueButton1.render('continueButton1');
						//Ext.getCmp("main_next").setDisabled(false);
						//Ext.getCmp("main_next").setSrc("resources/images/button_next.png");
						disableButton("next", false);
						//Ext.getCmp("urlButton"+sourceNum).setDisabled(true);
						Ext.getCmp("source_choice"+sourceNum).hide();
						//Ext.getCmp('add_button_panel'+sourceNum).hide();
						//Ext.getCmp('remove_button_panel'+sourceNum).show();
						
						//urlPanel = Ext.get('urlPanel'+sourceNum);
						//check.show();
						//check.alignTo(urlPanel, "c-c");
						Ext.getCmp("source_continue"+sourceNum).show();
						
						
					}	
					else{
						//console.log("Source "+sourceNum+": Failure.");
						failureTemplate.overwrite("continue"+sourceNum);
					}
				}});
				
			}
		});	
		
		/*
		remove_button = Ext.getCmp("source_remove_button"+sourceNum);
		console.log("Found remove_button: ",remove_button);
		remove_button.visibility = "visible";	
		*/
		
		return;
	}
	else {
		//console.log("Didn't find URL, ignoring");	
	}
};
	
/*
	else {
		var fileInput = Ext.getCmp("inputFile"+sourceNum);
		if (fileInput.value){
			var form = Ext.getCmp('fileForm'+sourceNum).getForm();
			
			if (fileInput.value.slice(-3) == "csv"){
				url = DOMAIN+"/DataEngine/"+CSVSLURPER; //+"?url="+urlValue;
			}
			else{
				url = DOMAIN+"/DataEngine/"+JSONSLURPER; //+"?url="+urlValue;
			}
			
			if(form.isValid()){
				form.submit({
					method: "POST",
					url: url,
					params: {format:'json'}, //force_mime_type: "text/plain"},  
					//force_mime_type: "text/plain",
					waitMsg: 'Uploading your file...',
					success: function(fp, o) {
						msg('Success', 'Processed file "' + o.result.file + '" on the server');
					},
					failure: function (form, o) {
						console.log("Failure with o = ", o);
						Ext.Msg.show({
							title: 'Add Request Failed',
							msg: o.result.error,
							buttons: Ext.Msg.OK,
							icon: Ext.Msg.ERROR
						});
					}
				});
			}
		}
		else{
			//console.log("No file found, either. Giving up.");
		}
	}
};
*/