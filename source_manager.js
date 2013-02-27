Ext.define('SourceManager', {
	url: 'http://www.placeholder.com',
 	online: true,
 
    constructor: function(url, online) {
        this.url = url;
        this.online = online;
        
        return this;
    },
 
    display: function() {
        console.log(this.url + ': ' + this.online);
    }
});