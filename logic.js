//var DOMAIN = "https://localhost:8443";
//var ROOT = "/datacreator";
			
var DOMAIN = "http://seamlessc2.mitre.org:8080";
var ROOT = "/test/html";

var JSONSLURPER = "jsonSlurper";
var CSVSLURPER = "csvSlurper";
var IDL = "idl";

//var DOMAIN = "http://mm184725-pc.mitre.org:8080";

var test_var = "hello world";

function merge_objects(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
}

//var test_obj1 = {att1: "hello", att2: "world"};
//var test_obj2 = {att3: "bonjour", att4: "monde"};
//var test_obj3 = merge_objects(test_obj1, test_obj2);

var chosen_attributes1 = [];
var chosen_attributes2 = [];
var linkedAttributes = [];

var attributeStore1 = [];
var attributeStore2 = [];

function fetchDropdownFromCheckbox(checkbox){
	//WARNING: WILL FAIL IF RECORD IS NOT TWO DIGITS
	//IMPROVEMENT: FIND THIRD-FROM-LAST '-' CHARACTER IN STRING AND SLICE FROM THERE
	var dropDownID = checkbox.id.slice(0, 2) + "type" + checkbox.id.slice(10)
	//var dropDown = Ext.getCmp(dropDownID);
	var dropDown = document.getElementById(dropDownID);
	console.log("Using ", checkbox, " found ", dropDown);
	return dropDown;
}

function changeDropdown(checkbox){
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

function renderCheckbox(value, p, record){
   		var idString = record.data.source+"-checkbox-"+record.id;
   		return '<input type="checkbox" attribute="'+value+'" id="'+idString+'" name="'+idString+'" onchange="changeDropdown(this);"/>';   	
   	};
 	
//Each key is a possible type.
//Each value is an array of items: 
//   * The zeroth is an internal value. I can't use the human-readable names, because it seems the value attribute of inputs doesn't like spaces
//   * The first is the human-readable name of the subtype.
//   * The second is the format specifier for the IDL if it exists, or null otherwise.
//   * The third is the Normalized DataField name if it exists, null otherwise
var TYPES = {
	"String":    [["String", "String", null, null], ["Title", "Title", null, "$title"], ["Description", "Description", null, "$description"]],
	"Integer":   [["Integer", "Integer", null, null], ["UUID", "UUID", null, "$uuid"]],
	"Date":      [["ISO8601", "ISO8601", "ISO8601", null], ["StartTimeISO8601", "StartTime (ISO8601)", "ISO8601", "$startTime"]], 
	"LatLonAlt": [["WGS84Lat", "WGS84: Latitude", "WGS84_Map", "$lat"], ["WGS84Lon", "WGS84: Longitude", "WGS84_Map", "$lon"]],
}	

function fetchFormat (typesSubarray, firstItem){
	for (i=0; i<typesSubarray.length; i++){
		if (typesSubarray[i][0] == firstItem){
			return typesSubarray[i];
		}	
	}
	console.log("WARNING: fetchFormat failed to find subarray! Looking for ", firstItem, " in ", typesSubarray);
	return null;
}

/*
for (key in TYPES){
	console.log(key, TYPES[key]);
}
*/
console.log(TYPES["String"]);

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
	console.log("Generated options string: ", returnString);
	return returnString;
}

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

var typeOptions = '<option value="String" selected="selected">String</option>\
					<option value="Integer">Integer</option>\
					<option value="Date">Date</option>\
					<option value="LatLonAlt">LatLonAlt</option>'

/* 	
var typeOptions = '<option value="String" selected="selected">Text</option>\
					<option value="Numeric">Numeric</option>\
					<option value="Location">Location</option>\
					<option value="Date">Date</option>\
					<option value="Time">Time</option>\
					<option value="DateTime">Date/Time</option>'
 	
 //var textOptions     = '<option value="Text">Text</option>'\
 //						'<option value="$title">Title</option>'
 
 //var numericOptions  = '<option value="Integer">Integer</option>'\
 //					   '<option value="$uuid">UUID</option>'
 						
 
 var locationOptions = '<option value="LatLonAlt" selected="selected">Lat/Lon/Alt</option>\
						<option value="LonLatAlt">Lon/Lat/Alt</option>\
						<option value="Lat">Latitude</option>\
						<option value="Lon">Longitude</option>\
						<option value="MGRS">MGRS</option>\
						<option value="UTM">UTM</option>'
 
 var dateOptions     = '<option value="MM/DD" selected="selected">MM/DD</option>\
						<option value="MM/DD/YY">MM/DD/YY</option>\
						<option value="MM/DD/YYYY">MM/DD/YYYY</option>\
						<option value="DD/MM/YY">DD/MM/YY</option>\
						<option value="DD/MM/YYYY">DD/MM/YYYY</option>\
						<option value="DD mon yy">DD Month YY</option>\
						<option value="DD mon yyyy">DD Month YYYY</option>\
						<option value="ddmonyy">DDMonthYY</option>\
						<option value="ddmonyyyy">DDMonthYYYY</option>'
 
 var timeOptions     = '<option value="HH:mm:ss" selected="selected">HH:mm:ss</option>\
						<option value="HH:mm">HH:mm</option>\
						<option value="HHmmss">HHmmss</option>\
						<option value="HHmm">HHmm</option>\
						<option value="Nnnnnnnnnnnnnnnnnn">Nnnnnnnnnnnnnnnnnn</option>'
 
 var datetimeOptions = '<option value="DDHHMM(Z)MONYY">DDHHMM(Z)MONYY</option>\
						<option value="YYYY-MM-DDTHH:MM(Z)">YYYY-MM-DDTHH:MM(Z)</option>'

 var SUBTYPES  = ["Location", "Date", "Time", "DateTime"];
 */
 
 	
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

function changeSubtype(dropdown){
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
		subdropdown.setVisible(match);		

		//var dropdownDOM = document.getElementById(idHeader+subtype+idFooter) 
		//dropdownDOM.disabled = match;
		
		if (match){
			//dropdown.show();
			subdropdown.dom.removeAttribute('disabled');
		}
		else {
			//dropdown.hide();
			subdropdown.dom.setAttribute('disabled', 'disabled');
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
 	
function renderDropdown(value, p, record){
   		var idString = record.data.source+"-type-" + record.id;
   		return '<select attribute="'+value+'" id="'+idString+'" name="'+value+'" onchange="changeSubtype(this);" disabled="disabled">'+typeOptions+'</select>';
   	};

function renderSubtype(value, p, record){
   		var idHeader = record.data.source+"-subtype-";
   		var idFooter = record.id;
   		/*//var textDD;
   		//var numericDD;
   		var locationDD = '<select style="display: none" attribute="'+value+'" id="'+idHeader+'Location-'+idFooter+'" name="'+value+'" disabled="disabled">'+locationOptions+'</select>';
   		var dateDD = '<select style="display: none" attribute="'+value+'" id="'+idHeader+'Date-'+idFooter+'" name="'+value+'" disabled="disabled">'+dateOptions+'</select>';
   		var timeDD = '<select style="display: none" attribute="'+value+'" id="'+idHeader+'Time-'+idFooter+'" name="'+value+'" disabled="disabled">'+timeOptions+'</select>';
   		var datetimeDD = '<select style="display: none" attribute="'+value+'" id="'+idHeader+'DateTime-'+idFooter+'" name="'+value+'" disabled="disabled">'+datetimeOptions+'</select>';
   		return locationDD + dateDD + timeDD + datetimeDD;
   		*/
   		returnString = "";
   		for (key in TYPES){
   			options = generateOptionsFromType(TYPES[key]);
   			returnString += ('<select style="display: none" attribute="'+value+'" id="'+idHeader+key+'-'+idFooter+'" name="'+value+'" disabled="disabled">'+options+'</select>');
   		}
   		return returnString;

   	};
   	
   

var generateSourceAddButtonPanel = function(sourceNum){
	var button = generateSourceAddButton(sourceNum);
	var panel = Ext.create('Ext.Panel', {
		layout: {
			type: 'hbox',
			align: 'stretch',
		},
		height: 25, 
		border: false,
		defaults: { border: false,},
		items: [
			{html:"", flex:1},
			button,
			{html:"", flex:1},
		],
	});
	return panel;
}

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


var executeAddButton = function(sourceNum){
	var urlInput = Ext.getCmp("urlInput"+sourceNum);
	//console.log("getting value: ", urlInput.value);
	if (urlInput.value){
		//console.log("Found URL, proceeding");
		var urlValue =  urlInput.value;
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
		//console.log("Preparing request: " + urlInput);
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
						var msg = sourceTemplate.applyTemplate({name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});
						Ext.Msg.show({
							title: 'Source Request Succeeded',
							msg: msg,
							buttons: Ext.Msg.OK,
						});
						//sourceTemplate.overwrite("continue"+sourceNum, {name: title, type: type, url: urlValue, dataRecords: new_store.getCount(), dataFields: keys.length, num: sourceNum});
						//continueButton1.render('continueButton1');
						Ext.getCmp("main_next").setDisabled(false);
						//Ext.getCmp("urlButton"+sourceNum).setDisabled(true);
					}	
					else{
						//console.log("Source "+sourceNum+": Failure.");
						failureTemplate.overwrite("continue"+sourceNum);
					}
				}});
				
			}
		});	
		return;
	}
	else {
		//console.log("No URL, trying file:");
		var fileInput = Ext.getCmp("inputFile"+sourceNum);
		if (fileInput.value){
			var form = Ext.getCmp('fileForm'+sourceNum).getForm();
			//console.log("Using form: ", form)
			/*
			Ext.Ajax.request({
					form: form,
					url: DOMAIN+"/DataEngine/csvSlurper",
					method: 'POST',
					isUpload: true,
				    params: { format: 'json' },
				    callback: function(original, successBool, response){
						//console.log("ResponseText: ", response.responseText);
					}
				});
			*/
			
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


var executeStep = function(stepNumber){
	console.log("executeStep called with number: ", stepNumber);
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
		
		var preview_panel = Ext.create('Ext.Panel', {
			id: "preview_panel" + num,
			layout: 'card',
			border: true,
			title: "Data Preview",
			flex: 1,
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
			],
		});
		
		formatted_keys = listFormatter(keys, num);
		temp_store = Ext.create('Ext.data.Store', {
				model: 'DataSource',
				data: formatted_keys,
		});
		//console.log("temp store = ", temp_store.data.items);
		var picker_grid = Ext.create('Ext.grid.Panel', {
			id: 'picker_grid'+num,
			store: temp_store,
			border: true,
			title: "Field Selection",
			flex: 1,
			columns: [
				{text: "", width: 40, dataIndex: 'name', renderer: renderCheckbox, sortable: false},
				{text: "Attribute", flex: 1, dataIndex: 'name', sortable: false},
				{text: "Type", flex:1, dataIndex: 'name', renderer: renderDropdown, sortable:false},
				{text: "Subtype", flex:1, dataIndex: 'name', renderer: renderSubtype, sortable:false},
			],
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
			flex: 1,
			items: [
				{html:"", width:30},
				picker_grid,
				{html:"", width:30},
				preview_panel,
				{html:"", width:30},

			],
		});
		
		 source_attribute.add(source);	
		 //Ext.getCmp("main_next").setDisabled(false);
		 
		 
	}
	else if (stepNumber == 2 || stepNumber == 4){
		if (stepNumber == 2){
			var source = 1;
			var chosen_attributes = chosen_attributes1;
		}
		else {
			var source = 2;
			var chosen_attributes = chosen_attributes2;
		}
		//console.log("Storing selected fields and field types");
		var checkboxList = Ext.query('*[id^='+source+'-checkbox]');
		var typeList = Ext.query('*[id^='+source+'-type]');
		//console.log("Found checkboxes: ", checkboxList.length);
		//console.log("Found types: ", typeList.length);
		
		var idlJSON = prepareIDLjson(); 
		var dropdown;
		var subdropdown;
		
		for (var i=0;i<checkboxList.length;i++) {
				var checkbox = checkboxList[i];
				if (checkbox.checked) {
					var type = typeList[i]; //THIS IS UNSAFE PROBABLY
					//alternatively, grab the id from the end of the name of the checkbox's id
					//and find the related element in typeList.
					//console.log("checked! using type: ", type.value, type.name);
					//jsonObject[type.name] = [type.value, type.name];
					chosen_attributes.push({"attribute": type.name, "value": type.value, "source": source});
					
					dropdown = fetchDropdownFromCheckbox(checkbox);
					subdropdown = fetchSubtypeFromTypeDropDown(dropdown);
					console.log("Found subdropdown: ", subdropdown);
					
					console.log("dropdown.value = ", dropdown.value);
					console.log("subdropdown.value = ", subdropdown.dom.value);
					console.log("TYPES subarray is: ", TYPES[dropdown.value]);
					
					format = fetchFormat(TYPES[dropdown.value], subdropdown.dom.value);  
					
					
					var output_name;
					if (format[3] == null){ //format[3] is the normalized name.
						output_name = type.name; //if it doesn't exist, use the original field name
					}
					else{
						output_name = format[3]; //if it does, use it
					}
					
					if(format[2] == null) {	//format[2] is the format option
						idlJSON.dslv[type.name] = [dropdown.value, output_name]; //if it doesn't exist, skip it
					}
					else {
						idlJSON.dslv[type.name] = [dropdown.value, format[2], output_name]; //if it does, use it
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
			}
		console.log("idl: ", idlJSON);
		
		var idlURL = DOMAIN + "/DataEngine/" + IDL; //+ "/31?_method=PUT" ; //this is what a put request would look like
		//var idlURL = DOMAIN + "/DataEngine/" + IDL + "/"+source+"?_method=PUT" ; //this is what a put request would look like
	
		
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
			}
		});
		
		if (stepNumber == 4) {
		
			var merge_grids = generatePickerPanel();
		
			merge_panel.add(merge_grids);
			
			merge_panel.doLayout();
			
			
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
		
		if (stepNumber == 2){
			Ext.getCmp("main_next").setDisabled(true);
		}
	}
	else if (stepNumber == 5){
		//console.log("Entering step 5");
		 Ext.getCmp("main_next").setDisabled(true);
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
						save_preview_panel.add(final_preview);					
					}
					else{
						//console.log("Not a success");
					}
				}});	
				
				
				
			}
		});
	}
}

function prepareIDLjson() {
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
	idlJSON.source_uri = "source uri placeholder";
	idlJSON.description = "description placeholder";

	idlJSON.dslv = new Object;

	return idlJSON;
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

function renderMergeCheckbox(value, meta, record, rowIndex){
   		var idString = record.data.source+"-merge-checkbox-"+record.id;
   		return '<input type="checkbox" attribute="'+value+'" id="'+idString+'" name="'+idString+'"/>'; 
   		//var rowClass = rowClassString(rowIndex, record.data.source);
   		//return '<input type="checkbox" class="'+rowClass+'" attribute="'+value+'" id="'+idString+'" name="'+idString+'"/>';   	
   	};
   	
function renderMergeRadio(value, meta, record){
		//console.log(value);
		//console.log(meta);
		//console.log(record);
		//console.log("--------");
		if (record.data.source == "1+2"){
			return "";
		}
   		var idString = record.data.source+"-merge-radio-"+record.id;
   		return '<input type="radio" name="source'+record.data.source+'" value="'+value+'" id="'+idString+'"/>'; 
   	};
   	
function renderMergeSubtype(value){
 	return 'N/A';  
};

function rowClassFunc(record, index){
	var s = record.get('source');
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

function generatePickerPanel(){
	var card_items1 = [];
	var card_items2 = [];
	 
	/*
	if (global_store.getCount() > global_store2.getCount()){
		var maxIndex = global_store.getCount();
	}
	else{
		var maxIndex = global_store2.getCount();
	}
	
	for (var index = 0; index < maxIndex; index++){
		var data_array = []
		if (index < global_store.getCount()){
			//console.log("global store is: ", global_store);
			var record = global_store.getAt(index);
			//console.log(record);
			for(var i=0; i<chosen_attributes1.length; i++){
				var attribute = chosen_attributes1[i].attribute;
				data_array.push({attribute: attribute, value: record.data[attribute], source:1});
			}
		}
		if (index < global_store2.getCount()){
			var record = global_store2.getAt(index);
			for(var i=0; i<chosen_attributes2.length; i++){
				var attribute = chosen_attributes2[i].attribute;
				data_array.push({attribute: attribute, value: record.data[attribute], source:2});
			}
		}
	*/
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
			data_array.push({attribute: attribute, value: record.data[attribute], source:sourceNumber});
		}
		card_items1.push(generateCardFromDataArray(data_array));
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
			data_array.push({attribute: attribute, value: record.data[attribute], source:sourceNumber});
		}
		card_items2.push(generateCardFromDataArray(data_array));
	});
	
	var merge_preview_panel1 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel1",
		layout: 'card',
		border: false,
		flex: 1,
		activeItem: 0,
		items: card_items1,
		
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
	var merge_preview_panel2 = Ext.create('Ext.Panel', {
		id: "merge_preview_panel2",
		layout: 'card',
		border: false,
		flex: 1,
		activeItem: 0,
		items: card_items2,
		
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
	
	//console.log("Attempting to use: ", chosen_attributes1.concat(chosen_attributes2));
	attributeStore1 = Ext.create('Ext.data.Store', {
		model: 'DataTrio',
		data: chosen_attributes1, //.concat(chosen_attributes2),
		autoLoad: true,
	});
	
	attributeStore2 = Ext.create('Ext.data.Store', {
		model: 'DataTrio',
		data: chosen_attributes2, //.concat(chosen_attributes2),
		autoLoad: true,
	});
	
	var picker_grid1 = Ext.create('Ext.grid.Panel', {
		id: 'merge_picker1',
		store: attributeStore1,
		//border: false,
		flex: 2,
		columns: [
			{text: "Link", width: 38, dataIndex: 'source', renderer: renderMergeRadio, sortable: false},
			{text: "Attribute", flex: 1, dataIndex: 'attribute', sortable: false},
			{text: "Type", flex:1, dataIndex: 'value', sortable:false},
			{text: "Subtype", flex:1, dataIndex: 'value', renderer: renderMergeSubtype, sortable:false},
			{text: "Source", width: 50, dataIndex: 'source'},
			
		],
		bbar: [
			'->', // greedy spacer so that the buttons are aligned to each side
			{
				text: '<div style="visibility: hidden;"><--</div>',
				handler: function(btn) {
					navigate(btn.up("panel"), "prev", 4);
				},
				disabled: true
			},
			{
				text: '<div style="visibility: hidden;"><--</div>',
				handler: function(btn) {
					navigate(btn.up("panel"), "next", 4);
				},
				disabled:true
			}
		],	
		viewConfig: {
			getRowClass: rowClassFunc,
		}
	});
	
	var picker_grid2 = Ext.create('Ext.grid.Panel', {
		id: 'merge_picker2',
		store: attributeStore2,
		//border: false,
		flex: 2,
		columns: [
			{text: "Link", width: 38, dataIndex: 'source', renderer: renderMergeRadio, sortable: false},
			{text: "Attribute", flex: 1, dataIndex: 'attribute', sortable: false},
			{text: "Type", flex:1, dataIndex: 'value', sortable:false},
			{text: "Subtype", flex:1, dataIndex: 'value', renderer: renderMergeSubtype, sortable:false},
			{text: "Source", width: 50, dataIndex: 'source'},
			
		],
		bbar: [//'->',
				{
					id: 'linkButton',
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
						//console.log("record1 is: ", record1);
						
						var radioList2 = Ext.query('*[id^=2-merge-radio]');
						var radio2;
						for (var i=0; i<radioList2.length; i++){
							if (radioList2[i].checked){
								radio2 = radioList2[i];
							}
						}
						/*
						console.log("Fetched: ", radio1, radio2);
						console.log("id is: ", radio1.id);
						console.log("last position of - is: ", radio1.id.lastIndexOf('-'));
						console.log("just id # is: ", radio1.id.substr(radio1.id.lastIndexOf('-')-19));
						*/
						var id2 = radio2.id.substr(radio2.id.lastIndexOf('-')-19);
						var record2;
						attributeStore2.each(function(record,idx){
							if(record.id == id2){
								record2 = record;
								//break;	
							}
						});						
						//console.log("record2 is: ", record2);
						
						linkedAttributes.push({source1: record1.data.attribute, source2: record2.data.attribute});
						//console.log("LinkedAttributes is now: ", linkedAttributes);
						
						//console.log("merge_panel is: ", merge_panel);
						var merge_grids_old = Ext.getCmp("merge_grids");
						//console.log("merge_grids is: ", merge_grids_old);
						
						merge_panel.remove(merge_grids_old, true);
						
						merge_grids_new = generatePickerPanel();
						
						merge_grids_new.doLayout();
						
						merge_panel.add(merge_grids_new);
												
						merge_panel.doLayout();
					}
				}
		],		
		viewConfig: {
			getRowClass: rowClassFunc, 
		}		
	});
	
	var picker_grid_holder = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 1,
		border: false,
		defaults: {border: false},
		items: [picker_grid1, picker_grid2],
	});
	
	var merge_preview_holder = Ext.create('Ext.Panel', {
		layout: {
			type: 'vbox',
			align: 'stretch',
		},
		flex: 1,
		border: false,
		defaults: {border: false},
		items: [merge_preview_panel1, merge_preview_panel2],
	});
	
	//var percent1 = Math.ceil((100 * linkedAttributes.length) / (100 * global_keys1.length) * global_store.getCount());
	//var percent2 = Math.ceil((100 * linkedAttributes.length) / (100 * global_keys2.length) * global_store2.getCount());
	
	if (linkedAttributes.length == 0) {
		var percent1 = 0;
		var percent2 = 0;
	}
	else {
		var percent1 = 4;
		var percent2 = 4;
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
		border: false,
		defaults: {border: false},
		items: [{html: percentHTML}],	
	});
	
	//console.log("merge_report_holder = ", merge_report_holder);
	
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
			picker_grid_holder,
			merge_preview_holder,
			//{html:"data placeholder", flex:2},
			merge_report_holder,
			{html:"", width:30},
			//preview_panel,
		],

	});	
	
	picker_grid1.getView().on('bodyscroll', function (event,target) {	
		merge_preview_panel1.layout.activeItem.scrollByDeltaY(picker_grid1.getView().getEl().getScroll().top - merge_preview_panel1.layout.activeItem.getView().getEl().getScroll().top);
	});
	
	picker_grid2.getView().on('bodyscroll', function (event,target) {	
		merge_preview_panel2.layout.activeItem.scrollByDeltaY(picker_grid2.getView().getEl().getScroll().top - merge_preview_panel2.layout.activeItem.getView().getEl().getScroll().top);
	});
	
	return merge_grids;
};

