App = Em.Application.create();

/* Models */
App.Player = Em.Object.extend({
    name : null,
    point : 0,
    isSelected : false,
    isEdit : false,
    id : null        
});

/* Controller */
App.playerController = Em.ArrayController.create({
	content: [],

	createPlayer : function(name) {
		var player = App.Player.create({name : name, id : this.guid()});
		this.pushObject(player);
	},
	s4 : function () {
    	return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    },
    guid : function () {
    	return (this.s4()+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+"-"+this.s4()+this.s4()+this.s4());
    },
    doTheUnset : function() {
    	this.setEach('isSelected', false);
    },
    selectedPlayer : function () {
    	return this.filterProperty('isSelected', true).get('length') === 0;
    }.property('@each.isSelected'),
    getSelectedDetails : function() {
    	return this.findProperty('isSelected', true);
    }.property('@each.isSelected'),
    removePlayer : function(id) {
    	this.filterProperty('id', id).forEach(this.removeObject, this);
    },
    playerNumbers : function() {
    	return this.get('length') === 0;
    }.property('length'),
    sortPlayers : function() {
    	return this.get('content').toArray().sort(function(a,b) {
    		if ( a.get('point') != b.get('point') )
    		{
    			return b.get('point') - a.get('point');
    		} else {
    			var aName = a.get('name').toLowerCase();
    			var bName = b.get('name').toLowerCase();
    			if ( aName < bName) return -1
    			if ( aName > bName) return 1
    			return 0
    		}
    	});
    }.property('content.@each.point').cacheable(),
});

/* Views */
App.insertPlayer = Em.TextField.extend({
    insertNewline : function() {
        var name = this.get('value');
        if (name) {
            App.playerController.createPlayer(name);
            this.set('value','');
        }
    }
});
App.editName = Em.TextField.extend({
    didInsertElement: function() {
    	this.$().focus();
    }
});

App.playerView = Em.View.extend({
	tagName : 'li',
	controller : App.playerController,

	click : function () {
		this.selectedPlayer();
	},
	doubleClick : function () {
		this.editSelected();
	},
	selectedPlayer : function () {
		this.unsetPlayers();
		var state = this.getPath('content.isSelected');
		this.setPath('content.isSelected', state? false:true);
	},
	unsetPlayers : function () {		
		this.controller.doTheUnset();
	},
	removeSelected : function () {
		var id = this.getPath('content.id');
		this.controller.removePlayer(id);
	},
	editSelected : function() {
		var id = this.getPath('content.id');
		this.setPath('content.isEdit', true);
		this.$().css({"background" : "none"});
	},
	keyUp: function(evt) {
	    if (evt.keyCode === 13) {
	      this.setPath('content.isEdit', false);
	      this.$().css({"background" : ""});
	    }
	},
	focusOut: function() {
	    this.setPath('content.isEdit', false);
	    this.$().css({"background" : ""});
	 }
});

App.scores = Em.View.extend({
	templateName: "player-details",

	addPoint : function() {
		var point = App.playerController.findProperty('isSelected', true).get('point');
		if( point < 50 ) {
			App.playerController.findProperty('isSelected', true).set('point', point+5);
		}
	},
	minusPoint : function() {
		var point = App.playerController.findProperty('isSelected', true).get('point');
		if ( point > 0 ) {
			App.playerController.findProperty('isSelected', true).set('point', point-5);
		}
	}
});

