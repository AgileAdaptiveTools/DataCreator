Ext.define('app.datacreator.TestClass', {
    name: 'Unknown',

    constructor: function(name) {
        if (name) {
            this.name = name;
        }

        return this;
    },

    eat: function(foodType) {
        alert(this.name + " is eating: " + foodType);

        return this;
    }
});

/*
var aaron = Ext.create('My.sample.Person', 'Aaron');
    aaron.eat("Salad"); // alert("Aaron is eating: Salad");
*/