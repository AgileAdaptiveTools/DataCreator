function generateSourceSelector(sourceNumber){ 
    var fileForm = Ext.create('Ext.form.Panel', {
    		id: "fileForm"+sourceNumber,
			flex: 1,
			border: false,
	
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
    
    var urlForm = new Ext.form.FormPanel({
      flex: 1,
      border: false,
      //layout: 'fit',
      items: [
      	 {html: "<div class='sourcePanel'>Web Address</div>", bodyStyle: "background: #DFE9F6; border: 0px;",},
         new Ext.form.TextArea({
         	 xtype: 'textfield',
			id:'urlInput'+sourceNumber,
			name: 'urlInput'+sourceNumber,
			label: "Web Address",
			hideLabel: 'true',
			height: 25,
			width: 300,
		}),
      ],
      //buttons: [urlButton1]
   });
       
    var dragForm = new Ext.form.FormPanel({	
		flex: 1,
		height: 200,
      	border: false,
      	items: [
      		 {html: "<div class='sourcePanel'>Drag and Drop<br/><br/><img src='resources/images/drophere.png'/></div>", bodyStyle: "border-width:0px;"},
      		 
         ]
     });
     
    var source_choice = Ext.create('Ext.Panel', {
    	layout: {
    		type: 'hbox',
    		align: 'stretch',
    	},
    	border: false,
    	flex: 6,
    	items: [
    		{html: "", width: 60, border: false},
    		dragForm,
    		{html: "<HR width=1, size=150/>", width: 20, border: false},
			fileForm,
			{html: "<HR width=1, size=150/>", width: 20, border: false},
			urlForm,
			{html: "", width: 60, border: false},
		
    	],
    });
    
	var source_continue = Ext.create('Ext.Panel', { 
		id: 'continue'+sourceNumber,
		border: false,
		flex: 5,
		layout: "fit",
		items: [{html: "<div class='continuePanel'></div>", border: false}],
	});
    
    var numberWord;
    if (sourceNumber == 1){
    	numberWord = "first";
    }
    else {
    	numberWord = "second";
    }
    var source_banner = generateBannerPanel("Select Data Source "+sourceNumber, "Select your first "+numberWord+" by dragging it from your saved sources on the left, enter the URL for it below or browse for it.");
    
    var source_add_button_panel = generateSourceAddButtonPanel(sourceNumber);
    
    var source_selector = Ext.create('Ext.Panel', {
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
				{html: "<div class='progressPanel'><img class='centered' src='resources/images/step1a.png'/></div>", height: 115},
				//{html: "<hr width='95%'/>", height: 20},
				{html: "", height: 30},
				source_banner,
				source_choice, 
				source_add_button_panel,
				{html: "", height: 15},
				{html: "<hr style='vertical-align:middle;' width='85%'/>", height: 10},
				{html: "", height: 15},
				source_continue,
				],
	});
		
	return source_selector;
};