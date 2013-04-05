//Ext.Loader.setConfig({enabled:true});

Ext.require('Ext.container.Viewport');
//Ext.require('Ext.field.Field');
//Ext.require('datacreator.TestClass');


    Ext.define('Data',{
        extend: 'Ext.data.Model',
        fields: ['id', 'label', 'description', 'parentuuid', 'uuid', 'starttime', 'source',
                 {name: 'location', mapping: 'location.coordinates'}],
    });
    Ext.define('Source',{
       extend: 'Ext.data.Model',
       fields: ['name', 'url'],
   });
   Ext.define('Datum',{
        extend: 'Ext.data.Model',
        fields: ['datum']
    });
	Ext.define('DataPair',{
        extend: 'Ext.data.Model',
        fields: ['attribute', 'value']
    });
    Ext.define('DataTrio',{
        extend: 'Ext.data.Model',
        fields: ['attribute', 'value', 'source']
    });
    Ext.define('DataFour',{
        extend: 'Ext.data.Model',
        fields: ['attribute', 'value', 'subvalue', 'source']
    });
    Ext.define('DataSource',{
        extend: 'Ext.data.Model',
        fields: [
        		'name', 
        		'source',
        		]
    });

   	
   	var global_store;
   	var global_store2;
   	var global_keys1;
   	var global_keys2;
   	   	  
 	Ext.namespace("Ext.ux");
	Ext.ux.comboBoxRenderer = function(combo) {
	  return function(value) {
		var idx = combo.store.find(combo.valueField, value);
		var rec = combo.store.getAt(idx);
		return rec.get(combo.displayField);
	  };
	}   	   	
 	
 	/*
 	var typeStore = new Ext.data.ArrayStore({
						fields: [
							'displayText',
							'attributeText',
						],
						data: [['Text', 'text'], 
							   ['Numeric', 'numeric'],
							   ['Time', 'time'],
							   ['Date', 'date'],
							   ['Date/Time', 'datetime'],
							   ['Location', 'location']]
	});
						
	var typeCombo = new Ext.form.ComboBox({
			//id: idString,
			store: typeStore,
			valueField: 'attributeText',
			displayField: 'displayText',
			
			typeAhead: true,
			triggerAction: 'all',
			lazyRender:true,
			mode: 'local',

	});
		
	function makeTypeCombo(id){
		returnCombo = new Ext.form.ComboBox({
			id: id,
			store: typeStore,
			valueField: 'attributeText',
			displayField: 'displayText',
			
			typeAhead: true,
			triggerAction: 'all',
			lazyRender:true,
			mode: 'local',
		});
		return returnCombo;
	}			
 	*/
 	
 	   	   	   	
   	function ajaxRequest(s) {
   		console.log(s);
   	};
   	
   	function mergeKeys(keys1, keys2) {
   		listB = []
   		list1 = []
   		list2 = []
   		for (var key in keys1) {
   			if (keys2.indexOf(keys1[key]) == (-1) ){
   				list1.push({"name": keys1[key], "source": "1"});
   			}
   			else {
   				listB.push({"name": keys1[key], "source": "1+2"});
   			}
   		}
   		for (var key in keys2) {
   			if (keys1.indexOf(keys2[key]) == -1 ){
   				list2.push({"name": keys2[key], "source": "2"});
   			}
   		}
   		//console.log("mergeKeys returning: ", listB.concat(list1,list2));
   		return listB.concat(list1,list2);
   	}
   	
   	function listFormatter(keys, source) {
   		//console.log("listFormatter received: ", keys);
   		returnList = []
   		for (var key in keys) {
   			returnList.push({"name": keys[key], "source": source});
   		}
   		//console.log("ListFormatter returning: ", returnList);
   		return returnList;
   	}   	
   	
   	function getSourceForKey(merged_keys, key) {
   		for (item in merged_keys) {
   			if (merged_keys[item].name == key) {
   				return merged_keys[item].source;
   			}
   		}
   		//console.log("warning: key not found:", key);
   		return "error";
   	}
   	
   	var navigate = function(panel, direction, num){
   		//console.log("navigate called!");
   		//console.log(panel);
   		//console.log(direction);
		var layout = panel.getLayout();
		layout[direction]();
		prev_id = 'move-prev' + num;
		next_id = 'move-next' + num;
		Ext.getCmp(prev_id).setDisabled(!layout.getPrev());
		Ext.getCmp(next_id).setDisabled(!layout.getNext());
	};
	
	/*
	var attribute_selector = Ext.create('Ext.Panel', {
		layout: {
			type: 'fit',
		},
		flex: 1,
		border: false,
		defaults: {border: false},
		items: [
				{id: "attribute_selection_panel", html: ""},
				//{id: "attribute_preview", html: ""},
		],
	});
	*/
	
	/*
	var submitAttributesButton = Ext.create('Ext.button.Button', {
		text: 'Submit',
		height: 50,
		handler: function(){ 
			//var checkboxList = Ext.ComponentQuery.query('input[id^=checkbox]');
			var checkboxList = Ext.query('*[id^=checkbox]');
			var typeList = Ext.query('*[id^=type]');
			var jsonObject = new Object;
			jsonObject.injestDL = new Object;
			jsonObject.injestDL.version = "version placeholder";
			jsonObject.injestDL.title = "title placeholder";
			jsonObject.injestDL.POC = "poc placeholder";
			jsonObject.injestDL.source = "source placeholder";
			jsonObject.injestDL.uuid = "uuid placeholder";
			//jsonObject.name = ["String", "a name goes here"];
			//console.log(checkboxList);
			for (var i in checkboxList) {
				var checkbox = checkboxList[i];
				//console.log("checkbox is: ", checkbox);
				if (checkbox.checked) {
					var type = typeList[i]; //THIS IS UNSAFE PROBABLY
					//console.log("checked! using type: ", type.value);
					jsonObject[type.name] = [type.value, type.name];
				}
				else {
					//console.log("unchecked");
				}
			}
			//console.log("Let's try JSON: ", Ext.encode(jsonObject));
		}
	});
	*/
		
    //var merge_banner = generateBannerPanel("Select Key Fields to Link the Data Sources", "Select fields that will link the two data sources together. They must be of the same type and format. The results of the linking is shown on the right.");
	var merge_banner = {html: "<img class='centered' src='resources/images/linkData.png'/>"}
	var merge_grids = generateMergePanel();
	console.log("Generated: ", merge_grids);
		
	var merge_panel = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		border: false,
		defaults: {border: false},
		items: [
				//{id: 'progress3', html: "<div class='progressPanel'><center>Data Source 1 -> Data Source 2 -> <b>Data Output</b> -> Save</center></div>", height: 50},
				{html: "<div class='progressPanel'><img class='centered' src='resources/images/step3.png'/></div>", height: 95},
				merge_banner,
				merge_grids,
				//attribute_selector,
				//{id: 'submitRow', html: "<div style='padding:15px; font-size:15px; background-color:#DFE9F6'><center><button>Submit</input></button></div>", height: 50},
				//submitAttributesButton,
				]	
	});	
   	
   	
	//merge_panel.add(merge_grids);		
   	
   	
    //var attribute_banner1 = generateBannerPanel("Select Data", "Select the data fields that you want to include in your new data source.");
	var attribute_banner1 = {html: "<img class='centered' src='resources/images/chooseData.png'/>"}
	
	var source_attribute1 = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		border: false,
		defaults: {border: false},
		items: [
				{html: "<div class='progressPanel'><img class='centered' src='resources/images/step1b.png'/></div>", height: 95},
				//{html: "<div class='progressPanel'><center><b>Data Source 1</b> -> Data Source 2 -> Data Output -> Save</center></div>", height: 50},
				 attribute_banner1,
				]	
	});	
	

    //var attribute_banner2 = generateBannerPanel("Select Data", "Select the data fields that you want to include in your new data source.");
	var attribute_banner2 = {html: "<img class='centered' src='resources/images/chooseData.png'/>"}
	
	var source_attribute2 = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		border: false,
		defaults: {border: false},
		items: [
				//{html: "<div class='progressPanel'><center>Data Source 1 -> <b>Data Source 2</b> -> Data Output -> Save</center></div>", height: 50},
				{html: "<div class='progressPanel'><img class='centered' src='resources/images/step2b.png'/></div>", height: 95},
				attribute_banner2,
				]	
	});
   	/*
   	var sourceMarkup = [
   		"<div class='popPanel'>",
   		'<div class="infoText">',
   		'Name: {name}<br/>',
   		'Type: {type}<br/>',
   		'URL: {url}<br/>',
   		'<br/>{dataRecords} Data Records, {dataFields} Data Fields<br/>',
   		'</div>',
   		'<div id="continueButton{num}"></div>',
   		'</div>',
   	];*/
   	var sourceMarkup = [
   		"<div class='popPanel'>",
   		'<div class="infoText">',
   		'Name: {name}<br/>',
   		'URL: {url}<br/>',
   		'<br/>{dataRecords} Data Records, {dataFields} Data Fields<br/>',
   		'</div>',
   		'</div>',
   	];
   	var sourceTemplate = Ext.create('Ext.Template', sourceMarkup);
   	
   	var blankMarkup = [
   		"<div class='invisible'>",
   		'Blank.<br/>',
   		'Blank.<br/>',
   		'<br/>Blank.<br/>',
   		'</div>',
   	];
   	var blankTemplate = Ext.create('Ext.Template', blankMarkup);
   	
   	var failureMarkup = [
   		"<div class='continuePanel'>",
   		//'<div style="padding:15px;">',
   		'<b>Could not load data.</b><br/>',
   		'Please try another source.<br/>',
   		'</div>',
   	];
   	var failureTemplate = Ext.create('Ext.Template', failureMarkup);   	
   	
   	/*
   	function createTemplateFromKeys(keys){
   		var markup = 
   		for (key in keys) {
   			markup = markup + "
   		}
   		return Ext.create('Ext.Template', markup);
   	
   	}
   	*/
    
    function slurperPass(){
   		//console.log("SlurperPass called!");
   	}
   	
   	function slurperFail(){
   		//console.log("SlurperFail called...");
   	}
   	  	
  
	var source_selector1 = generateSourceSelector(1);
	
	var source_selector2 = generateSourceSelector(2);
		
	//var result_banner = generateBannerPanel("Save", "");
    var result_banner = {html: "<img class='centered' src='resources/images/saveData.png'/>"}
    	
    var save_form_panel =  Ext.create('Ext.form.Panel', {
		id: "saveForm",
		title: "Enter Data Source Information",
		flex: 3,
		layout: 'anchor',
   		defaults: {
        	anchor: '90%',
        	labelWidth: 120,
    	},
    	bodyPadding: 10,
		
		/*
		defaults: {
			anchor: '100%',
			allowBlank: false,
			msgTarget: 'side',
			labelWidth: 50
		},
		*/

		items: [
			{
				xtype: 'textfield',
				name: 'data_source_name',
				fieldLabel: 'Name',
	 
			},
			{
				xtype: 'textareafield',
				name: 'description',
				fieldLabel: 'Description'
			},
			{
				xtype: 'textfield',
				name: 'keywords',
				fieldLabel: 'Keywords'
			},
			
			{
				xtype: 'combo',	
				anchor: "40%",
				name: 'sharing',			
				fieldLabel: 'Sharing',
				store: new Ext.data.SimpleStore({
					data: [
						[1, 'Public'],
						[2, 'Restricted'],
						[3, 'Private'],				],
					id: 0,
					fields: ['value', 'text']	
				}),
			}
		],

		buttons: [{
			text: 'Save',
			handler: function(){
				//console.log("Save clicked!");
				Ext.Msg.show({
					title: 'Saved',
					msg: "Success!",
					buttons: Ext.Msg.OK,
				});	
			}
		}],	
	});
	
	var save_preview_panel =  Ext.create('Ext.Panel', {
		id: "savePreview",
		layout: 'fit',
		flex: 3,
		border: false,
		items: [
		],
	});
    	
    var save_panel = Ext.create('Ext.Panel', {
    	flex: 1,
    	border: false,
    	//defaults: {border: false},
    	layout: {
    		type: "hbox",
    		align: "stretch",
    	},
    	items: [
    			{html: "", flex:1, border: false},
    			save_form_panel, 
    			//{html: "", width:20, border: false}, 
    			//save_preview_panel,
    			{html: "", flex:1, border: false},
    		],
    });
		
	var merge_result = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		defaults: {
			border: false,
		},
		border: false,
		items: [
			//{id: 'progress5', html: "<div class='progressPanel'><center>Data Source 1 -> Data Source 2 -> <b>Data Output</b> -> Save</center></div>", height: 50},   
			{html: "<div class='progressPanel'><img class='centered' src='resources/images/step4.png'/></div>", height: 95},
			result_banner,
			save_panel,
		]
	});
								
    var input_details = Ext.create('Ext.Panel', {
    	id: "input_details",
    	layout: 'card',
    	border: false,
    	activeItem: 0,
    	flex: 1,
    	items: [
    		source_selector1,
    		source_attribute1,
    		source_selector2,
    		source_attribute2,
    		merge_panel,
    		merge_result,
    	]
    });
    
    
    var step = 0;
    
    var main_navigate = function(direction, stepNumber){
   	 	var panel = Ext.getCmp('input_details');
   	 	var layout = panel.getLayout();
		layout[direction]();
		//Ext.getCmp("main_prev").setDisabled(!layout.getPrev());
		disableButton("prev", !layout.getPrev());
		if(direction=="next"){
			executeStep(stepNumber);
		}
		else{
			//Ext.getCmp("main_next").setDisabled(false); 
			disableButton("next", false);
			reverseStep(stepNumber);
		}
   	}
    
    var main_prev_button = Ext.create('Ext.Img', {
    	id: "main_prev",
    	class: "clickable",
    	src: "resources/images/button_back_disabled.png",
    	width: 60,
    	disabled: true,
		listeners: {
			el: {
				click: function() {
					main_navigate("prev", step);
					step--;
				}	
			}
    	}
	});
	
	
	var main_next_button = Ext.create('Ext.Img', {
    	id: "main_next",
    	//baseCls: "clickable",
    	src: "resources/images/button_next_disabled.png",
    	width: 60,
    	disabled: true,
		listeners: {
			el: {
				click: function() {
					if(!main_next_button.disabled){
						step++;
						main_navigate("next", step);
					}
				}
			}
		}
	});
	
	function disableButton(direction, doDisable){
		var button = Ext.getCmp("main_"+direction);
		button.setDisabled(doDisable);
		if (doDisable) {
			button.setSrc("resources/images/button_"+direction+"_disabled.png");
			button.removeCls("clickable");
		}
		else {
			button.setSrc("resources/images/button_"+direction+".png");
			button.addCls("clickable");
		}
	}
	
	
    /*
    var main_prev_button = Ext.create('Ext.button.Button', {
    	id: "main_prev",
    	width: 100,
    	disabled: true,
		text: 'Previous',
		handler: function() {
			step--;
			main_navigate("prev", step);
		}
	});
	
	
	var main_next_button = Ext.create('Ext.button.Button', {
    	id: "main_next",
    	width: 100,
    	disabled: true,
		text: 'Next',
		handler: function() {
			step++;
			main_navigate("next", step);
		}
	});
	*/

    var navigation_bar = Ext.create('Ext.Panel', {
    	height: 50,
    	border: false,
    	defaults: {border: false},
    	layout: {
    		type: 'hbox',
    		align: 'stretch',
    	},
    	items: [
    		{html:"", width:30},
    		main_prev_button,
    		{html: "", flex: 1},
    		main_next_button,
    		{html:"", width:30},
    	],
    });
    
    var input_panel = Ext.create('Ext.Panel', {
    	id: "input_panel",
    	border: false,
    	flex: 1,
    	layout: {
    		type: 'vbox',
    		align: 'stretch',
    	},
    	items: [
    		input_details,
    		{id: "spacer", html:"", height: 10, border:false,},
    		navigation_bar,
    	],
    });
    
    var tree_store = Ext.create('Ext.data.TreeStore', {
		root: {
			expanded: true,
			children: [
				{
				text: "Public",
				expanded: true,		
				children: [
					{ text: "lorum", leaf: true },
					{ text: "ipsum", expanded: true, children: [
						{ text: "dolor", leaf: true },
						{ text: "sit", leaf: true}
					] },
					{ text: "amet", leaf: true }
				]
				},
				{
				text: "Private",
				expanded: true,		
				children: [
					{ text: "dolorem", leaf: true },
					{ text: "consectetur", leaf: true },
					{ text: "tempor", leaf: true }
				]
				},
				{
				text: "Clipboard",
				expanded: true,		
				children: [
					{ text: "quisquam", leaf: true },
				]
				},
			]
		}
	});

	var tree_placeholder = Ext.create('Ext.tree.Panel', {
		title: 'John Hancock',
		layout: 'fit',
		width: 150,
		height: 490,
		store: tree_store,
		rootVisible: false,
		//border: false,
	});
    
    var main_panel = Ext.create('Ext.Panel', {
		//title: 'Input Panel',
		border: false,
		layout: {
        	type: 'hbox',
        	align: 'stretchmax'
    	},
		items: [
					//source_grid, event_panel,
					//{id: 'test1', region: 'west',  html: "Placeholder", width: 198, height: 400},
					tree_placeholder,
					input_panel,
				],
		//width: 1000,
		//height: 400,
	});

var delayLaunch = new Ext.util.DelayedTask(function(){
    Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            border: false,
            items: [
                main_panel,
            ]
    });
    blankTemplate.overwrite("continue1", {});
	blankTemplate.overwrite("continue2", {});
});

Ext.application({
    name: 'DataCreator',
    launch: function() {
    	delayLaunch.delay(1); //doesn't work
        /*
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            border: false,
            items: [
                main_panel,
            ]
        });
        */    
    }
});

var source = new SourceManager('www.google.com', true);
source.display(); 

main_panel.doLayout();
