// PATH Variables -- used to build references to the Slurper server

//var DOMAIN = "https://localhost:8443";
//var ROOT = "/datacreator";
			
var DOMAIN = "http://seamlessc2.mitre.org:8080";
var ROOT = "/test/html";

var JSONSLURPER = "jsonSlurper";
var CSVSLURPER = "csvSlurper";
var IDL = "idl";
var PDL = "pdl";

//var DOMAIN = "http://mm184725-pc.mitre.org:8080";

var test_var = "hello world";

//creates a new object with all the attributes/values of two objects
//if there is overlap, obj2's value will take precedent. Used to preview a merge.
function merge_objects(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

//var test_obj1 = {att1: "hello", att2: "world"};
//var test_obj2 = {att3: "bonjour", att4: "monde"};
//var test_obj3 = merge_objects(test_obj1, test_obj2);

//various global variables that should really be kept in a SourceManager class
var chosen_attributes1 = [];
var chosen_attributes2 = [];
var linkedAttributes = [];

var attributeStore1 = [];
var attributeStore2 = [];

var sourceURL1 = "";
var sourceURL2 = "";

var furthestStep = 0;

var linked = false;

var idlID1;
var idlID2;
var pdlID;

//OLD
//takes a checkbox and returns the associated dropdown
function fetchDropdownFromCheckbox(checkbox){
	//WARNING: WILL FAIL IF RECORD IS NOT TWO DIGITS
	//IMPROVEMENT: FIND THIRD-FROM-LAST '-' CHARACTER IN STRING AND SLICE FROM THERE
	var dropDownID = checkbox.id.slice(0, 2) + "type" + checkbox.id.slice(10)
	//var dropDown = Ext.getCmp(dropDownID);
	var dropDown = document.getElementById(dropDownID);
	console.log("Using ", checkbox, " found ", dropDown);
	return dropDown;
}

function fetchDropdownFromCheckboxById(checkboxID){
	//WARNING: WILL FAIL IF RECORD IS NOT TWO DIGITS
	//IMPROVEMENT: FIND THIRD-FROM-LAST '-' CHARACTER IN STRING AND SLICE FROM THERE
	var dropDownID = checkboxID.slice(0, 2) + "type" + checkboxID.slice(10)
	//var dropDown = Ext.getCmp(dropDownID);
	var dropDown = document.getElementById(dropDownID);
	console.log("Using ", checkboxID, " found ", dropDown);
	return dropDown;
}

//OLD
//called when a checkbox changes -- makes the associated type dropdown active or inactive
function changeDropdown(checkbox, checked){
	//WARNING: WILL FAIL IF RECORD IS NOT TWO DIGITS
	//IMPROVEMENT: FIND THIRD-FROM-LAST '-' CHARACTER IN STRING AND SLICE FROM THERE
	var dropDownID = checkbox.id.slice(0, 2) + "type" + checkbox.id.slice(10)
	//var dropDown = Ext.getCmp(dropDownID);
	var dropDown = document.getElementById(dropDownID);
	if (checkbox.checked) {
		dropDown.disabled = false;
	}
	else {
		dropDown.disabled = "disabled";
	}
}

//called when a checkbox changes -- makes the associated type dropdown active or inactive
function changeDropdownById(checkboxID, checked){
	//WARNING: WILL FAIL IF RECORD IS NOT TWO DIGITS
	//IMPROVEMENT: FIND THIRD-FROM-LAST '-' CHARACTER IN STRING AND SLICE FROM THERE
	var dropDownID = checkboxID.slice(0, 2) + "type" + checkboxID.slice(10)
	//var dropDown = Ext.getCmp(dropDownID);
	var dropDown = document.getElementById(dropDownID);
	var dropDownExt = Ext.get(dropDownID);
	dropDownExt.setVisibilityMode(Ext.Element.DISPLAY);
	if (checked) {
		dropDown.disabled = false;
		dropDownExt.setVisible(true);
	}
	else {
		dropDown.disabled = "disabled";
		dropDownExt.setVisible(false);
	}
	changeSubtype(dropDown, checked);
}

//OLD
//builds a checkbox
function renderCheckbox(value, p, record){
   		var idString = record.data.source+"-checkbox-"+record.id;
   		return '<input type="checkbox" attribute="'+value+'" id="'+idString+'" name="'+idString+'" onchange="changeDropdown(this);"/>';   	
   	};
 	
//Each key is a possible type.
//Each value is an array of arrays. Each array specifies a subtype, with the values being equal to: 
//   * The zeroth is a format specifier, an internal value. I can't use the human-readable names, because it seems the value attribute of inputs doesn't like spaces
//   * The first is the human-readable name of the subtype.
//   * The second is the format specifier for the IDL if it exists, or null otherwise.
//   * The third is the Normalized DataField name if it exists, null otherwise
var TYPES = {
	"String":    [["String", "String", null, null], ["Title", "Title", null, "$title"], ["Description", "Description", null, "$description"]],
	"Integer":   [["Integer", "Integer", null, null], ["UUID", "UUID", null, "$uuid"]],
	"Date":      [["ISO8601", "ISO8601", "ISO8601", null], ["StartTimeISO8601", "StartTime (ISO8601)", "ISO8601", "$startTime"]], 
	"LatLonAlt": [["WGS84Lat", "WGS84: Latitude", "WGS84_Map", "$lat"], ["WGS84Lon", "WGS84: Longitude", "WGS84_Map", "$lon"]],
}	

//given a format specifier (see above), returns the appropriate subtype array
function fetchFormat (typesSubarray, firstItem){
	for (i=0; i<typesSubarray.length; i++){
		if (typesSubarray[i][0] == firstItem){
			return typesSubarray[i];
		}	
	}
	console.log("WARNING: fetchFormat failed to find subarray! Looking for ", firstItem, " in ", typesSubarray);
	return null;
}

//given a subtype array, builds the options for a combobox based on that type
function generateOptionsFromType(subtypeArray){
	var returnString = "";
	for(i in subtypeArray){
		var displayName = subtypeArray[i][1];
		/*
		var valueName; 
		if (subtypeArray[i][2] == null){
			valueName = displayName;
		}
		else {
			valueName = subtypeArray[i][2]
		}
		*/
		valueName = subtypeArray[i][0];
		returnString += '<option value='+valueName+'>'+displayName+'</option>'
	}
	//console.log("Generated options string: ", returnString);
	return returnString;
}

//generates an array based on the keys of the TYPES dictionary
//used whereever enumeration over the possible types is necessary
function generateOptionsArray(TYPES){
	optionsArray = [];
	for(key in TYPES){
		optionsArray.push(generateOptionsFromType(TYPES[key]));
	}
	return optionsArray;
}

//stringOptions = generateOptionsFromType(TYPES["String"])
//Options = generateOptionsFromType(TYPES["String"])
//Options = generateOptionsFromType(TYPES["String"])
//Options = generateOptionsFromType(TYPES["String"])
//console.log(stringOptions);

optionsArray = generateOptionsArray(TYPES);
//console.log(optionsArray);

//the dropdown for Type. Should be generated from optionsArray instead of hardcoded.
var typeOptions = ' <option value="String">String</option>\
					<option value="Integer">Integer</option>\
					<option value="Date">Date</option>\
					<option value="LatLonAlt">LatLonAlt</option>'
 

// 	given a dropdown, fetch the associated subtype dropdown
function fetchSubtypeFromTypeDropDown(dropdown){
	var chosen_subtype = dropdown.value;
	
	idHeader = dropdown.id.slice(0, 2) + "subtype-"
	idFooter = "-" + dropdown.id.slice(7)
	var subtype;
	var subdropdown;
	var match;
	for (subtype in TYPES) { //iterates over keys
		//subtype = key;
		subdropdown = Ext.get(idHeader+subtype+idFooter);
		match = (chosen_subtype == subtype);
		if (match) {
			console.log("Using ", dropdown, " found ", subdropdown);
			return subdropdown;
		}
	}
	return false;
}

//called whenever a type dropdown changes -- makes the appropriate subtype dropdown visible
function changeSubtype(dropdown, checked){
	var chosen_subtype = dropdown.value;
	
	/*
	if (chosen_subtype == "location"){
		locationDisplay = "inline";
	}
	*/
	idHeader = dropdown.id.slice(0, 2) + "subtype-"
	idFooter = "-" + dropdown.id.slice(7)
	/*
	console.log("using header: ", idHeader);
	console.log("using footer: ", idFooter);
	console.log("Looking for location Dropdown: "+idHeader+"location-"+idFooter);
	*/
	/*
	var locationDD = document.getElementById(idHeader+"location-"+idFooter);
	locationDD.enabled = locationDisplay;
	*/

	var subtype;
	var subdropdown;
	var match;
	for (subtype in TYPES){ //iterates over keys
		//subtype = key;
		subdropdown = Ext.get(idHeader+subtype+idFooter);
		match = (chosen_subtype == subtype);
		//console.log("Currently working on: ", subtype, "matches value? ", match);
		subdropdown.setVisibilityMode(Ext.Element.DISPLAY);
	

		//var dropdownDOM = document.getElementById(idHeader+subtype+idFooter) 
		//dropdownDOM.disabled = match;
		
		if (match && checked){
			//dropdown.show();
			subdropdown.dom.removeAttribute('disabled');
			subdropdown.setVisible(true);	
		}
		else {
			//dropdown.hide();
			subdropdown.dom.setAttribute('disabled', 'disabled');
			subdropdown.setVisible(false);	
		}
		
		//dropdownDOM.
		//console.log("new states: ", dropdown, dropdownDOM);
	}
	
	/*
	var locationDD = Ext.get(idHeader+"location"+idFooter);
	console.log("Found locationDD: ", locationDD);
	locationDD.setVisible(chosen_subtype == "location");
	//locationDD.setEnabled(chosen_subtype == "location");
	//locationDD.setStyle('display', locationDisplay);
	
	var locationDD2 = document.getElementById(idHeader+"location-"+idFooter);
	console.log("found also:", locationDD2);
	locationDD2.disabled = false;
	*/
	
	/*
	//console.log("Attempting to fetch picker grid using id: ", 'picker_grid'+idHeader[0]);
	var picker_grid = Ext.getCmp('picker_grid'+idHeader[0]);
	console.log("Found picker_grid: ", picker_grid);
	picker_grid.doLayout();
	*/
	return;
} 	
 
 //render functions for grids	
function renderDropdown(value, p, record){
   		var idString = record.data.source+"-type-" + record.id;
   		return '<select style="display: none" attribute="'+value+'" id="'+idString+'" name="'+value+'" onchange="changeSubtype(this, true);" disabled="disabled">'+typeOptions+'</select>';
   	};

function renderSubtype(value, p, record){
   		var idHeader = record.data.source+"-subtype-";
   		var idFooter = record.id;
   		returnString = "";
   		for (key in TYPES){
   			options = generateOptionsFromType(TYPES[key]);
   			returnString += ('<select style="display: none" attribute="'+value+'" id="'+idHeader+key+'-'+idFooter+'" name="'+value+'" disabled="disabled">'+options+'</select>');
   		}
   		return returnString;

   	};
   	
//markup for the Merge Preview
var percentMarkup = [
   		"<div class='continuePanel'>",
   		'{fieldsJoined} field{s} joined.<br/><br/>',
   		'<div class="infoText">',
   		'Source 1: {s1join}/{s1total} records joined.<br/>',
   		'Source 2: {s2join}/{s2total} records joined.<br/>',
   		'</div>',
   		'</div>',
   	];
var percentTemplate = Ext.create('Ext.Template', percentMarkup);

var reverseStep = function(stepNumber){
	console.log("reverseStep called with number: ", stepNumber);
	//DON'T DO THIS HERE!!!
	//INSTEAD, WHEN REMOVE BUTTON IS CLICKED, THAT'S WHEN YOU DESTROY THE FIELD PICKER GRID!!!!
	/*
	if (stepNumber == 1 || stepNumber == 3){
		if (stepNumber == 1){
			var last_item = source_attribute1.items.items.pop();
			last_item.destroy();
			disableButton("next", false);
		}
		if (stepNumber == 3){
			var last_item = source_attribute2.items.items.pop();
			last_item.destroy();
			disableButton("next", false);
		}
	}
	else if (stepNumber == 4) {
	
	}
	*/
}

//called whenever the "next" button is clicked
//handles UI setup, remote calls and data storage
var executeStep = function(stepNumber){
	console.log("executeStep called with number: ", stepNumber);
	//Step #1 and Step #3 involve preparing the Attribute Selection grid after a source have been chosen.
	//It needs to set up both the Attribute Selection Panel and the Source Preview panel.
	if (furthestStep < stepNumber){
		furthestStep = stepNumber;
	}
	if (stepNumber == 1 || stepNumber == 3){
		//console.log("Parsing data source");
		var card_items = []
		var temp_string = "";
		var i = 0;
		var data_array = [];
		var temp_store; //a store that holds one record's data
		if (stepNumber == 1){
			var data_store = global_store;
			var keys = global_keys1;
			var num = 1;
			var source_attribute = source_attribute1;
		}
		else{
			var data_store = global_store2;
			var keys = global_keys2;
			var num = 2;
			var source_attribute = source_attribute2;
		}
		//check.hide();
		
		data_store.each(function(record,idx){
			 //console.log("new card with: ", record.data);
			 i = 0;
			 data_array = [];
			 for (var item in record.data){
				data_array[i] = {attribute: item, value:record.data[item], source:num};
				i++;
			 };
			 //console.log("data_array set to: ", data_array);
			 temp_store = Ext.create('Ext.data.Store', {
				model: 'DataTrio',
				data: data_array,
			 });
			 //console.log("temp_store SET: ", temp_store);
			 var data_grid = Ext.create('Ext.grid.Panel', {
				store: temp_store,
				columns: [
					//{text: "Attribute", flex: 1, dataIndex: 'attribute', sortable: false},
					{text: "Value", flex:1, dataIndex: 'value', sortable: false}
				],
					
			 });
			 card_items[idx] = data_grid; 
			 //index = idx;
		});		
		
		//the panel that displays the data source's data
		var preview_panel = Ext.create('Ext.Panel', {
			id: "preview_panel" + num,
			layout: 'card',
			border: true,
			title: "Data Preview",
			flex: 1,
			height: 250,
			activeItem: 0,
			items: card_items,
			bbar: [
				'->',
				{
					id: 'move-prev'+num,
					text: '<--',
					handler: function(btn) {
						navigate(btn.up("panel"), "prev", num);
					},
					disabled: true
				},
				{
					id: 'move-next'+num,
					text: '-->',
					handler: function(btn) {
						navigate(btn.up("panel"), "next", num);
					}
				}
			]
		});
		
		formatted_keys = listFormatter(keys, num);
		temp_store = Ext.create('Ext.data.Store', {
				model: 'DataSource',
				data: formatted_keys,
		});
		//console.log("temp store = ", temp_store.data.items);
		var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly: true,
			listeners: {
				deselect: function(model, record, index) {
					//id = record.get('id');
					//alert(id);
					var idString = record.data.source+"-checkbox-"+record.id;
					changeDropdownById(idString, false);
				},
				select: function(model, record, index) {
					//id = record.get('id');
					//alert(id);
					var idString = record.data.source+"-checkbox-"+record.id;
					changeDropdownById(idString, true);
				}
			}
		});
		
		//the panel that display the data source's fields
    	var picker_grid = Ext.create('Ext.grid.Panel', {
			id: 'picker_grid'+num,
			store: temp_store,
			border: true,
			title: "Field Selection",
			flex: 1,
			height: 250,
			selModel: checkboxModel,
	
			columns: [
				//{text: "", width: 40, dataIndex: 'name', renderer: renderCheckbox, sortable: false},
				{text: "Attribute", flex: 1, dataIndex: 'name', sortable: false},
				{text: "Type", flex:1, dataIndex: 'name', renderer: renderDropdown, sortable:false},
				{text: "Subtype", flex:1, dataIndex: 'name', renderer: renderSubtype, sortable:false},
			],
			
			listeners: {
				selectionchange: function(trigger, record, index) {
					if(record.length>0) {
						disableButton("next", false);
					}
					else {
						disableButton("next", true);
					}
				}
			}
			/*
			bbar: [
				{
					id: 'select-none'+num,
					text: 'Select None',
					handler: function(btn) {
						var checkboxList = Ext.query('*[id^='+num+'-checkbox]');
						for (var i=0;i<checkboxList.length;i++) {
							checkboxList[i].checked = false;
							changeDropdown(checkboxList[i]);
						}
					},
				},
				{
					id: 'select-all'+num,
					text: 'Select All',
					handler: function(btn) {
						var checkboxList = Ext.query('*[id^='+num+'-checkbox]');
						for (var i=0;i<checkboxList.length;i++) {
							checkboxList[i].checked = true;
							changeDropdown(checkboxList[i]);
						}
					}
				},
				'->',
			],	
			*/			
		 });
		 //picker_grid1.doLayout();
		 
		 var source = Ext.create('Ext.Panel', {
			id: "source"+num,
			layout: {
				type: 'hbox',
				align: 'stretch',
			},
			border: false,
			defaults: {border: false},
			height: 250,
			items: [
				{html:"", width:30},
				picker_grid,
				{html:"", width:30},
				preview_panel,
				{html:"", width:30},

			],
		});
		
		 source_attribute.add(source);	
		 disableButton("next", true);
		 
	}
	//Steps #2 and #4 are after the user has finished with an Attribute Selection screen. 
	//It stores their specification, generates the IDL and sends it off.
	else if (stepNumber == 2 || stepNumber == 4){
		if (stepNumber == 2){
			chosen_attributes1 = [];
			var source = 1;
			var chosen_attributes = chosen_attributes1;
			var source_uri = sourceURL1;
			var idlID = 'idlID1';
		}
		else {
			chosen_attributes2 = [];
			var source = 2;
			var chosen_attributes = chosen_attributes2;
			var source_uri = sourceURL2;
			var idlID = 'idlID2';
		}
		console.log("Storing selected fields and field types");
		//var checkboxList = Ext.query('*[id^='+source+'-checkbox]');
		var picker_grid = Ext.getCmp('picker_grid'+source);
		var checkboxList = picker_grid.getSelectionModel().getSelection();
		
		var typeList = Ext.query('*[id^='+source+'-type]');
		console.log("Found checkboxes: ", checkboxList.length);
		//console.log("Found types: ", typeList.length);
		
		var idlJSON = prepareIDLjson(source_uri); 
		var dropdown;
		var subdropdown;
		
		//prepare the JSON and send it off
		for (var i=0;i<checkboxList.length;i++) {
				var checkbox = checkboxList[i];		
				checkboxID = source+"-checkbox-"+checkbox.id;
				dropdown = fetchDropdownFromCheckboxById(checkboxID);
				subdropdown = fetchSubtypeFromTypeDropDown(dropdown);
				console.log("Found subdropdown: ", subdropdown);
				
				chosen_attributes.push({"attribute": checkbox.data.name, "value": dropdown.value, "subvalue": subdropdown.dom.value, "source": source});
				console.log("chosen_attributes is now: ", chosen_attributes);
				
				console.log("dropdown.value = ", dropdown.value);
				console.log("subdropdown.value = ", subdropdown.dom.value);
				//console.log("TYPES subarray is: ", TYPES[dropdown.value]);
				
				format = fetchFormat(TYPES[dropdown.value], subdropdown.dom.value);  
				
				var output_name;
				if (format[3] == null){ //format[3] is the normalized name.
					output_name = dropdown.value; //if it doesn't exist, use the original field name
				}
				else{
					output_name = format[3]; //if it does, use it
				}
				
				if(format[2] == null) {	//format[2] is the format option
					idlJSON.dslv[checkbox.data.name] = [dropdown.value, output_name]; //if it doesn't exist, skip it
				}
				else {
					idlJSON.dslv[checkbox.data.name] = [dropdown.value, format[2], output_name]; //if it does, use it
				} 
				
				/*
				if (subdropdown) {
					idlJSON.dslv[type.name] = [type.value, "$"+type.name, subdropdown.dom.value];
				}
				else {
					idlJSON.dslv[type.name] = [type.value, "$"+type.name];
				}
				*/	
			}
		console.log("idl: ", idlJSON);
		
		if (window[idlID]) {
			console.log("Found idlID, using it.");
			idlURL = DOMAIN + "/DataEngine/" + IDL + "/" + window[idlID] + "?_method=PUT" ; 
		}
		else {
			console.log("No idlID, generating new.");
			idlURL = DOMAIN + "/DataEngine/" + IDL; //+ "/31?_method=PUT" ;
		}
		
		console.log("Sending request to ", idlURL);	
		Ext.Ajax.request({
		   method: "POST",		   
		   //_method: "PUT", //this doesn't work. 
		   url: idlURL, 
		   jsonData: idlJSON,
		   //params: { format: 'json' },
		   callback: function(original, successBool, response){
				//console.log("ResponseText: ", response.responseText);
				var jsonResponse = JSON.parse(response.responseText);
				console.log("IDL responded: ", jsonResponse);
				var responseString = jsonResponse.idl_uri;
				var splitString = responseString.split("/");
				window[idlID] = splitString[(splitString.length)-1] //final item in the split string
			}
		});
		
		if (stepNumber == 4) {
			/*
			var merge_grids_old = Ext.getCmp("merge_grids");
			console.log("merge_grids_old is: ", merge_grids_old);
	
			if(merge_grids_old){
				console.log("Destroying old merge grids!");
				merge_panel.remove(merge_grids_old, true);
				merge_grids_old.destroy();
			}
			linkedAttributes = [];
			linked = false;
		
			//generates the panel that holds the merge sources UI
			var merge_grids = generatePickerPanel();
		
			merge_panel.add(merge_grids);
			
			merge_panel.doLayout();
			*/
			
			unlinkSources();
			
			updatePickerPanels();
			updatePreviewPanel(1, false);
			updatePreviewPanel(2, false);

			/*		
			var picker_grid1Scroller = picker_grid1.verticalScroller;
			console.log("scroll = ", picker_grid1Scroller);
			picker_grid1Scroller.on({
				'bodyscroll': function (event) {
					console.log("bodyScroll called!");
					var picker_grid2Scroller = picker_grid2.verticalScroller;
					console.log("this  picker is: ", picker_grid1Scroller);
					console.log("other picker is: ", picker_grid2Scroller);
					console.log(picker_grid1Scroller.el.dom.scrollTop);
					console.log(picker_grid2Scroller.el.dom.scrollTop);
					picker_grid2Scroller.el.dom.scrollTop =  picker_grid1Scroller.el.dom.scrollTop;
				}, scope: this
			});
			
			var picker_grid2Scroller = picker_grid2.verticalScroller;
			picker_grid2Scroller.on({
				'bodyscroll': function (event) {
					var picker_grid1Scroller = picker_grid1.verticalScroller;
					picker_grid1Scroller.el.dom.scrollTop =  picker_grid2Scroller.el.dom.scrollTop;
				}, scope: this
			});
			*/
			//this one works
			/*
			picker_grid1.getView().on('bodyscroll', function (event,target) {	
				merge_preview_panel1.layout.activeItem.scrollByDeltaY(picker_grid1.getView().getEl().getScroll().top - merge_preview_panel1.layout.activeItem.getView().getEl().getScroll().top);
			});
			*/
			
			//this one needs work
			/*
			merge_preview_panel1.layout.items.each(function( item ) {
				//merge_preview_panel1.layout.activeItem.getView().on('bodyscroll', function (event, target) {
				console.log("Item!: ", item);
				//picker_grid1.scrollByDeltaY(merge_preview_panel1.layout.activeItem.getView().getEl().getScroll().top - picker_grid1.getView().getEl().getScroll().top);
			});
			*/
		}
	
		//this condition can be removed if the user MUST do something on the merge page before being allowed to proceed
		//if (stepNumber == 2){
		if (true){
			//Ext.getCmp("main_next").setDisabled(true);
			//Ext.getCmp("main_next").setSrc("resources/images/button_next_disabled.png");
			disableButton("next", true);
		}
	}
	//occurs after the user has finished the merge sources page. The results are packaged into a PDL and sent off, then the final preview is generated
	else if (stepNumber == 5){
		//console.log("Entering step 5");
		 //Ext.getCmp("main_next").setDisabled(true);
		 //Ext.getCmp("main_next").setSrc("resources/images/button_next_disabled.png");
		disableButton("next", true);
		//var joinURL = DOMAIN+"/DataEngine/join/inner?idls=1,2&pdl=3";
		var joinURL = "http://seamlessc2.mitre.org:8080/DataEngine/join/inner?idls=2,4&pdl=3&format=json";
		//console.log("Making GET request to: ", joinURL);
		Ext.Ajax.request({
		   method: "GET",
		   url: joinURL,
		   //params: { format: 'json' },
		   callback: function(original, successBool, response){
				//console.log("ResponseText: ", response.responseText);
				var jsonResponse = JSON.parse(response.responseText);
				//console.log(jsonResponse);
				//console.log("events: ", jsonResponse.feed.records);
				//console.log("# of events: ", jsonResponse.feed.records.length);	
				
				var keys = Object.keys(jsonResponse.feed.records[0].ext);
				
				Ext.define("MergeData",{
					extend: 'Ext.data.Model',
					fields: keys,
				});
							
				var new_store = Ext.create('Ext.data.Store', {
					id: "data_store3",
					model: "MergeData",
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
						var card_items = [];
						new_store.each(function(record,idx){
							//console.log("record = ", record);
							var data_array = [];
							for (var item in record.data){
								data_array.push({attribute: item, value:record.data[item]});
							}
							card_items.push(generateCardFromDataPairArray(data_array));
						});
						var final_preview = Ext.create('Ext.Panel', {
							id: "final_preview",
							layout: 'card',
							border: false,
							activeItem: 0,
							items: card_items,
							
							bbar: [
								'->', // greedy spacer so that the buttons are aligned to each side
								{
									id: 'move-prev5',
									text: '<--',
									handler: function(btn) {
										navigate(btn.up("panel"), "prev", 5);
									},
									disabled: true
								},
								{
									id: 'move-next5',
									text: '-->',
									handler: function(btn) {
										navigate(btn.up("panel"), "next", 5);
									}
								}
							],						
						});
						Ext.getCmp("savePreview").add(final_preview);					
					}
					else{
						//console.log("Not a success");
					}
				}});	
				
				
				
			}
		});
	}
}

function prepareIDLjson(source_uri) {
	var idlJSON = new Object;
	
	idlJSON.version = "Ingest Description Language (IDL) v1.1212.27";
	
	//placeholders for now
	idlJSON.idl_uuid = 5; 
	idlJSON.title = "Title placeholder";
	idlJSON.poc = "POC placeholder";
	idlJSON.creationDate = "2013-01-08T06:00:02Z";
	idlJSON.modificationDate = "2013-01-08T06:00:02Z";
	idlJSON.source = "source placeholder";
	idlJSON.source_format = "source_format placeholder";
	idlJSON.source_uri = source_uri;
	idlJSON.description = "description placeholder";

	idlJSON.dslv = new Object;

	return idlJSON;
}

function preparePDLjson() {
	var pdlJSON = new Object;
	
	pdlJSON.version = "Process Description Language (PDL) v1.1301.22";
	
	//placeholders for now
	pdlJSON.pdl_uuid = 5; 
	pdlJSON.title = "Title placeholder";
	pdlJSON.poc = "POC placeholder";
	pdlJSON.creationDate = "2013-01-08T06:00:02Z";
	pdlJSON.modificationDate = "2013-01-08T06:00:02Z";
	pdlJSON.description = "description placeholder";
	pdlJSON.select = new Object;
	pdlJSON.where = new Object;

	return pdlJSON;
}


function rowClassString(s, index){
	if (s == 1) {
		if (index % 2 == 0) {
			return 'source1Row-Even';
		}
		else {
			return 'source1Row-Odd';
		}
		
	} else if (s == 2) {
		if (index % 2 == 0) {
			return 'source2Row-Even';
		}
		else {
			return 'source2Row-Odd';
		}
	}
	else {
		if (index % 2 == 0) {
			return 'sourceBothRow-Even';
		}
		else {
			return 'sourceBothRow-Odd';
		}
	}
};

function generateBannerPanel(title, text){	
	var banner_panel = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		border: false,
		defaults: {border:false},
		height: 100,
		items: [
			{html:"<div class='banner'>"+title+"</div>", flex:1},
			{html:"<div class='text'>"+text+"</div>", height: 40},
			//title_panel,
			//text_panel,
			//preview_panel,
		],

	});
	return banner_panel;
}

function generateCardFromDatum(input){
	//console.log("Building card with input: ", input);
	var temp_store = Ext.create('Ext.data.Store', {
		fields: ["datum"],
		data: {'items': [{"datum": input}]},
		proxy: {
			type: 'memory',
			reader: {
				type: 'json',
				root: 'items'
			}
		}
	});
	//console.log("Built store: ", temp_store);
	var data_grid = Ext.create('Ext.grid.Panel', {
		store: temp_store,
		hideHeaders: true,
		height: 28,
		columns: [
			{text: "", flex:1, dataIndex: 'datum', sortable: false}
		],	
	});
	return data_grid;
}

function generateCardFromDataArray(data_array){
	var temp_store = Ext.create('Ext.data.Store', {
		model: 'DataTrio',
		data: data_array,
		autoLoad: true,
	});
	var data_grid = Ext.create('Ext.grid.Panel', {
		store: temp_store,
		columns: [
			{text: "Output Data", flex:1, dataIndex: 'value', sortable: false}
		],
		viewConfig: {
			getRowClass: rowClassFunc,
		},		
	});
	return data_grid;
}

function generateCardFromDataPairArray(data_array){
	var temp_store = Ext.create('Ext.data.Store', {
		model: 'DataPair',
		data: data_array,
		autoLoad: true,
	});
	var data_grid = Ext.create('Ext.grid.Panel', {
		store: temp_store,
		columns: [
			{text: "Attribute", flex:1, dataIndex: 'attribute', sortable: false},
			{text: "Value", flex:1, dataIndex: 'value', sortable: false}
		],
		viewConfig: {
			getRowClass: rowClassFunc, 

		},		
	});
	return data_grid;
}

function unlinkSources() {
	for(var i=0; i<chosen_attributes1.length; i++){
		chosen_attributes1[i].source = "1";
	}
	for(var i=0; i<chosen_attributes2.length; i++){
		chosen_attributes2[i].source = "2";
	}
	linkedAttributes = []
	linked = false;

}

function linkSources(record1, record2) {
		console.log("record1 and record2 are: ", record1, record2);
		if (linked) {
			for(var i=0; i<chosen_attributes1.length; i++){
				chosen_attributes1[i].source = "1";
			}
			for(var i=0; i<chosen_attributes2.length; i++){
				chosen_attributes2[i].source = "2";
			}
			linkedAttributes = []
		}
		
		linkedAttributes.push({source1: record1.data.attribute, source2: record2.data.attribute});
		linked = true;
		
		disableButton("next", false);
}

function findSelected(source){
	console.log("Entered findSelected!");
	var radioList = Ext.query('*[id^='+source+'-merge-radio]');
		var radio;
		for (var i=0; i<radioList.length; i++){
			if (radioList[i].checked){
				radio = radioList[i];
			}
		}
		if (radio) {
			console.log("Found radio: ", radio);
		}
		else {
			console.log("Source ", source, " not found.");
			return null;
		}
		
		var id = radio.id.substr(radio.id.lastIndexOf('-')-19);
		console.log("id: ", id);
		var returnValue = null;
		if (source==1){		
			attributeStore1.each(function(record,idx){
				//console.log(Object.prototype.toString.call(id), " vs. ", Object.prototype.toString.call(record.id));
				if(record.id == id){
					console.log("Found match! Record is: ", record);
					returnValue = record;
					//break;
					//console.log("At least this never fires.");
				}
			});
			console.log("Returning: ", returnValue);
			return returnValue;
		}
		else {
			attributeStore2.each(function(record,idx){
				if(record.id == id){
					console.log("Found match! Record is: ", record);
					returnValue = record;
					//break;
					//console.log("At least this never fires.");
				}
			});
			console.log("Returning: ", returnValue);
			return returnValue;
		}
		return returnValue;
}

function generateLinkButton(){
	return { id: 'linkButton',
	text: 'Link',
	handler: function(btn) {
		//console.log("Link clicked");
		var radioList1 = Ext.query('*[id^=1-merge-radio]');
		var radio1;
		for (var i=0; i<radioList1.length; i++){
			if (radioList1[i].checked){
				radio1 = radioList1[i];
			}
		}
		var id1 = radio1.id.substr(radio1.id.lastIndexOf('-')-19);
		var record1;
		//var record1 = attributeStore1.getById(id1);
		//var record1 = attributeStore1.getAt(attributeStore1.findExact('id', id1));
		attributeStore1.each(function(record,idx){
			if(record.id == id1){
				record1 = record;
				//break;	
			}
		});						
		console.log("record1 is: ", record1);
	
		var radioList2 = Ext.query('*[id^=2-merge-radio]');
		var radio2;
		for (var i=0; i<radioList2.length; i++){
			if (radioList2[i].checked){
				radio2 = radioList2[i];
			}
		}
		
		console.log("Fetched: ", radio1, radio2);
		console.log("id is: ", radio1.id);
		console.log("last position of - is: ", radio1.id.lastIndexOf('-'));
		console.log("just id # is: ", radio1.id.substr(radio1.id.lastIndexOf('-')-19));
		
		var id2 = radio2.id.substr(radio2.id.lastIndexOf('-')-19);
		var record2;
		
		
		attributeStore2.each(function(record,idx){
			if(record.id == id2){
				record2 = record;
				//break;	
			}
		});
								
		console.log("record2 is: ", record2);
	
		linkedAttributes.push({source1: record1.data.attribute, source2: record2.data.attribute});
		linked = true;
		console.log("LinkedAttributes is now: ", linkedAttributes);
	
		//console.log("merge_panel is: ", merge_panel);
		var merge_grids_old = Ext.getCmp("merge_grids");
		//console.log("merge_grids is: ", merge_grids_old);
	
		merge_panel.remove(merge_grids_old, true);
	
		merge_grids_new = generatePickerPanel();
	
		merge_grids_new.doLayout();
	
		merge_panel.add(merge_grids_new);
							
		merge_panel.doLayout();
		
		//Ext.getCmp("main_next").setDisabled(false);
		//Ext.getCmp("main_next").setSrc("resources/images/button_next.png");
		disableButton("next", false);
	}}
};

function generateUnlinkButton(){
	return {
	id: 'unlinkButton',
	text: 'Unlink',
	handler: function(btn) {
		for(var i=0; i<chosen_attributes1.length; i++){
			chosen_attributes1[i].source = "1";
		}
		for(var i=0; i<chosen_attributes2.length; i++){
			chosen_attributes2[i].source = "2";
		}
	
		linkedAttributes = []
		linked = false;
		console.log("LinkedAttributes is now: ", linkedAttributes);
	
		//console.log("merge_panel is: ", merge_panel);
		var merge_grids_old = Ext.getCmp("merge_grids");
		//console.log("merge_grids is: ", merge_grids_old);
	
		merge_panel.remove(merge_grids_old, true);
	
		merge_grids_new = generatePickerPanel();
	
		merge_grids_new.doLayout();
	
		merge_panel.add(merge_grids_new);
							
		merge_panel.doLayout();
		
		//Ext.getCmp("main_next").setDisabled(true);
		//Ext.getCmp("main_next").setSrc("resources/images/button_next_disabled.png");
		disableButton("next", true);
	}}
};
		

function renderMergeCheckbox(value, meta, record, rowIndex){
   		var idString = record.data.source+"-merge-checkbox-"+record.id;
   		return '<input type="checkbox" attribute="'+value+'" id="'+idString+'" name="'+idString+'"/>'; 
   		//var rowClass = rowClassString(rowIndex, record.data.source);
   		//return '<input type="checkbox" class="'+rowClass+'" attribute="'+value+'" id="'+idString+'" name="'+idString+'"/>';   	
   	};
   	
function renderMergeRadio1(value, meta, record){
	return renderMergeRadio(value, meta, record, "1");
}	

function renderMergeRadio2(value, meta, record){
	return renderMergeRadio(value, meta, record, "2");
}	   
   
function renderMergeRadio(value, meta, record, source){
		//console.log(value);
		//console.log(meta);
		//console.log(record);
		//console.log("--------");
		/*if (record.data.source == "1+2"){
			return "";
		}*/
		var selected = "";
		
		/*
		//For whatever reason, radio buttons "checked" in this manner don't count.
		if (linkedAttributes.length > 0){
			//console.log("record.data.attribute is: ", record.data.attribute);
			//console.log("seeking attribute: ", linkedAttributes[0]["source"+source]);
		
			if (record.data.attribute == linkedAttributes[0]["source"+source]){
				selected = "checked='checked' ";
			}
		}
		*/
		
   		var idString = record.data.source+"-merge-radio-"+record.id;
   		return '<input type="radio" name="source'+source+'" value="'+value+'" id="'+idString+'" '+selected+' />'; 
   	};

//sometimes you just don't want to render anything.   	
function renderNothing(value, meta, record){
	return '';
}
   	
function rowClassFunc(record, index){
	var s = record.get('source');
	//console.log("Source = ", s);
	if (s == 1) {
		if (index % 2 == 0) {
			return 'source1Row-Even';
		}
		else {
			return 'source1Row-Odd';
		}
		
	} else if (s == 2){
		if (index % 2 == 0) {
			return 'source2Row-Even';
		}
		else {
			return 'source2Row-Odd';
		}
	}
	else {
		if (index % 2 == 0) {
			return 'sourceBothRow-Even';
		}
		else {
			return 'sourceBothRow-Odd';
		}
	}
};

function generateMergePanel(){
	var merge_preview_placeholder1 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel1",
		layout: 'card',
		height: 50,
		items: [],
		autoscroll: true,

		bbar: [
			'->', // greedy spacer so that the buttons are aligned to each side
			{
				id: 'move-prev3',
				text: '<--',
				handler: function(btn) {
					navigate(btn.up("panel"), "prev", 3);
				},
				disabled: true
			},
			{
				id: 'move-next3',
				text: '-->',
				handler: function(btn) {
					navigate(btn.up("panel"), "next", 3);
				}
			}
		],
	});
	
	var merge_preview_placeholder2 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel2",
		layout: 'card',
		height: 50,
		items: [],
		autoscroll: true,

		bbar: [
			'->', // greedy spacer so that the buttons are aligned to each side
			{
				id: 'move-prev4',
				text: '<--',
				handler: function(btn) {
					navigate(btn.up("panel"), "prev", 4);
				},
				disabled: true
			},
			{
				id: 'move-next4',
				text: '-->',
				handler: function(btn) {
					navigate(btn.up("panel"), "next", 4);
				}
			}
		],
	});		
	
	var source1_holder = Ext.create('Ext.Panel', {
		id: "source1_holder",
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 2,
		border: false,
		defaults: {border: false},
		items: [{html: "merge_picker1", id: "merge_picker1", height: 210}, //picker_grid1, 
				{html: "", height: 10, border: false},
				merge_preview_placeholder1
				],
	});
	
	var source2_holder = Ext.create('Ext.Panel', {
		id: "source2_holder",
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 2,
		border: false,
		defaults: {border: false},
		items: [{html: "merge_picker2", id: "merge_picker2", height: 210}, //picker_grid2,
				{html: "", height: 10, border: false},
				merge_preview_placeholder2
				]
	});
	
	if (linkedAttributes.length == 1){
		var s = '';
	}
	else{
		var s = 's';
	}
	percentHTML = percentTemplate.applyTemplate({fieldsJoined: 0, s: s,
												s1join: 0, s1total: 0,
												s2join: 0, s2total: 0});
	
	var merge_report_holder = Ext.create('Ext.Panel', {
		layout: 'fit',
		flex: 1,
		title: "Merge Preview",
		defaults: {border: false},
		items: [{html: percentHTML}],	
	});

	var merge_grids = Ext.create('Ext.Panel', {
		id: "merge_grids",
		layout: {
			type: 'hbox',
			align: 'stretch',
		},
		border: false,
		defaults: {border: false},
		flex: 1,
		items: [
			{html:"", width:30},
			source1_holder,
			{html:"", width:10},
			source2_holder,
			{html:"", width:10},
			merge_report_holder,
			{html:"", width:30},
		],

	});	

	return merge_grids;
}

function updatePickerPanels(){
	Ext.getCmp("merge_picker1").destroy();
	Ext.getCmp("merge_picker2").destroy();
		
	global_store.each(function(record,idx){
		var data_array = [];
		for(var i=0; i<chosen_attributes1.length; i++){
			var attribute = chosen_attributes1[i].attribute;
			var sourceNumber = 1;
			for(var j=0; j<linkedAttributes.length;j++){
				//console.log("Comparing: ", linkedAttributes[j].source1, attribute);
				if(linkedAttributes[j].source1 == attribute){
					sourceNumber = 3;
					chosen_attributes1[i].source = "1+2";
					break;
				}
			}
			//data_array.push({attribute: attribute, value: record.data[attribute], source:sourceNumber});
		}
		//card_items1.push(generateCardFromDataArray(data_array));
	});
		
	global_store2.each(function(record,idx){
		var data_array = [];
		for(var i=0; i<chosen_attributes2.length; i++){
			var attribute = chosen_attributes2[i].attribute;
			var sourceNumber = 2;
			for(var j=0; j<linkedAttributes.length;j++){
				//console.log("Comparing: ", linkedAttributes[j].source2, attribute);
				if(linkedAttributes[j].source2 == attribute){
					sourceNumber = 3;
					chosen_attributes2[i].source = "1+2";
					break;
				}
			}
			//data_array.push({attribute: attribute, value: record.data[attribute], source:sourceNumber});
		}
		//card_items2.push(generateCardFromDataArray(data_array));
	});
		
	//console.log("Attempting to use: ", chosen_attributes1.concat(chosen_attributes2));
	attributeStore1 = Ext.create('Ext.data.Store', {
		model: 'DataFour',
		data: chosen_attributes1, //.concat(chosen_attributes2),
		autoLoad: true,
	});
	
	attributeStore2 = Ext.create('Ext.data.Store', {
		model: 'DataFour',
		data: chosen_attributes2, //.concat(chosen_attributes2),
		autoLoad: true,
	});
	
	if (linked){
		var linkColumn1 = {text: "Link", width: 38, dataIndex: 'attribute', renderer: renderMergeRadio1, sortable: false};
		var linkColumn2 = {text: "Link", width: 38, dataIndex: 'attribute', renderer: renderMergeRadio2, sortable: false};
		var linkButton = generateUnlinkButton();
	}
	else{
		var linkColumn1 = {text: "Link", width: 38, dataIndex: 'attribute', renderer: renderMergeRadio1, sortable: false};
		var linkColumn2 = {text: "Link", width: 38, dataIndex: 'attribute', renderer: renderMergeRadio2, sortable: false};
		var linkButton = generateLinkButton();
	}
	
	var checkboxModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly: true,
			listeners: {
				deselect: function(model, record, index) {
					//id = record.get('id');
					//alert(id);
					var idString = record.data.source+"-checkbox-"+record.id;
					changeDropdownById(idString, false);
				},
				select: function(model, record, index) {
					//id = record.get('id');
					//alert(id);
					var idString = record.data.source+"-checkbox-"+record.id;
					changeDropdownById(idString, true);
				}
			}
		});

	var picker_grid1 = Ext.create('Ext.grid.Panel', {
		id: 'merge_picker1',
		store: attributeStore1,
		//border: false,
		height: 210,
		disableSelection: true,
		columns: [
			linkColumn1,
			{text: "Attribute", flex: 1, dataIndex: 'attribute', sortable: false},
			{text: "Type", flex:1, dataIndex: 'value', sortable:false},
			{text: "Subtype", flex:1, dataIndex: 'subvalue', sortable:false},
			{text: "Source", width: 50, dataIndex: 'source'},
			
		],
		viewConfig: {
			getRowClass: rowClassFunc,
		},
		listeners: {
				itemclick: function(t, record, item, index, event, options) {
					console.log("itemclick")

					updatePreviewPanel(1, true);
										
					var selected1 = findSelected(1); //picker_grid1.getSelectionModel().selected.items;				
					var selected2 = findSelected(2); //picker_grid2.getSelectionModel().selected.items;
					if (selected1 && selected2) {
						linkSources(selected1, selected2);
						updatePickerPanels();
					}
				}
		}
	});
	
	var picker_grid2 = Ext.create('Ext.grid.Panel', {
		id: 'merge_picker2',
		store: attributeStore2,
		//border: false,
		height: 210,
		disableSelection: true,
		columns: [
			linkColumn2,
			{text: "Attribute", flex: 1, dataIndex: 'attribute', sortable: false},
			{text: "Type", flex:1, dataIndex: 'value', sortable:false},
			{text: "Subtype", flex:1, dataIndex: 'subvalue', sortable:false},
			{text: "Source", width: 50, dataIndex: 'source'},
			
		],	
		viewConfig: {
			getRowClass: rowClassFunc, 
		},		
		listeners: {
				itemclick: function(t, record, item, index, event, options) {
					console.log("itemclick")

					updatePreviewPanel(2, true);	
					
					var selected1 = findSelected(1); //picker_grid1.getSelectionModel().selected.items;
					var selected2 = findSelected(2); //picker_grid2.getSelectionModel().selected.items;
					if (selected1 && selected2) {
						linkSources(selected1, selected2);
						updatePickerPanels();
					}
				}
		}
	});
	
	Ext.getCmp("source1_holder").insert(0, picker_grid1);
	Ext.getCmp("source2_holder").insert(0, picker_grid2);
	/*
	var merge_preview_placeholder1 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel1",
		layout: 'card',
		height: 50,
		items: [],
		autoscroll: true,

		bbar: [
			'->', // greedy spacer so that the buttons are aligned to each side
			{
				id: 'move-prev3',
				text: '<--',
				handler: function(btn) {
					navigate(btn.up("panel"), "prev", 3);
				},
				disabled: true
			},
			{
				id: 'move-next3',
				text: '-->',
				handler: function(btn) {
					navigate(btn.up("panel"), "next", 3);
				}
			}
		],
	});
	
	var merge_preview_placeholder2 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel2",
		layout: 'card',
		height: 50,
		items: [],
		autoscroll: true,

		bbar: [
			'->', // greedy spacer so that the buttons are aligned to each side
			{
				id: 'move-prev4',
				text: '<--',
				handler: function(btn) {
					navigate(btn.up("panel"), "prev", 4);
				},
				disabled: true
			},
			{
				id: 'move-next4',
				text: '-->',
				handler: function(btn) {
					navigate(btn.up("panel"), "next", 4);
				}
			}
		],
	});		
 	
	var source1_holder = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 2,
		border: false,
		defaults: {border: false},
		items: [picker_grid1, 
				{html: "", height: 10, border: false},
				merge_preview_placeholder1
				],
	});
	
	var source2_holder = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 2,
		border: false,
		defaults: {border: false},
		items: [picker_grid2,
				{html: "", height: 10, border: false},
				merge_preview_placeholder2
				],
	});
	*/
	
	//DEMO STUFF -- will be replaced
	//var percent1 = Math.ceil((100 * linkedAttributes.length) / (100 * global_keys1.length) * global_store.getCount());
	//var percent2 = Math.ceil((100 * linkedAttributes.length) / (100 * global_keys2.length) * global_store2.getCount());
			
	//return merge_grids;
};

function updatePreviewPanel(sourceNumber, useData){
	var card_items = [];
	
	var sourceHolder;
	var dataStore;
	var selected;
	var nextNumber;
	
	if(sourceNumber == 1){
		sourceHolder = Ext.getCmp("source1_holder");
		dataStore = global_store;
		nextNumber = 3;
		selected = findSelected(1);
	}
	else{
		sourceHolder = Ext.getCmp("source2_holder");
		dataStore = global_store2;
		selected = findSelected(2);
		nextNumber = 4;
	}
	
	console.log("SourceHolder: ", sourceHolder);
	//If useData is false, we want to proceed and generate placeholders.
	//If selected exists, we want to proceed and use whatever we found.
	//If we do want to use data, but there's none to be used, just leave the previews as they are.
	if (useData && !selected) {
		console.log("Updating preview panel with nothing selected. Skipping.");
		return;
	}
	
	else {
	 	console.log("Updating preview panel with selected: ", selected);
		if (useData){			
			dataStore.each(function(storeRecord,idx){
				card_items.push(generateCardFromDatum(storeRecord.get(selected.data.attribute)));
			});
		}
		var preview_old = Ext.getCmp("merge_preview_panel"+sourceNumber);
		sourceHolder.remove(preview_old);
		preview_old.destroy();
		var merge_preview_panel = Ext.create('Ext.Panel', {
			id: "merge_preview_panel"+sourceNumber,
			layout: 'card',
			height: 50,
			items: card_items,
			autoscroll: true,

			bbar: [
				'->', // greedy spacer so that the buttons are aligned to each side
				{
					id: 'move-prev'+nextNumber.toString(),
					text: '<--',
					handler: function(btn) {
						navigate(btn.up("panel"), "prev", nextNumber);
					},
					disabled: true
				},
				{
					id: 'move-next'+nextNumber.toString(),
					text: '-->',
					handler: function(btn) {
						navigate(btn.up("panel"), "next", nextNumber);
					}
				}
			],
		});
		sourceHolder.add(merge_preview_panel);
	}
}

function updateMergeResults(){
	if (linkedAttributes.length == 0) {
		var percent1 = 0;
		var percent2 = 0;
	}
	else {
		var percent1 = 0;
		var percent2 = 0;
	}
	
	if (linkedAttributes.length == 1){
		var s = '';
	}
	else{
		var s = 's';
	}
	percentHTML = percentTemplate.applyTemplate({fieldsJoined: linkedAttributes.length, s: s,
												s1join: percent1, s1total: global_store.getCount(),
												s2join: percent2, s2total: global_store2.getCount()});
												
	var merge_report_holder = Ext.create('Ext.Panel', {
		layout: 'fit',
		flex: 1,
		title: "Merge Preview",
		defaults: {border: false},
		items: [{html: percentHTML}],	
	});
	
	
}

