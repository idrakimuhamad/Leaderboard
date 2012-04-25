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
    	//alert(title);
    },
    playerNumbers : function() {
    	return this.get('length') === 0;
    	//return players > 1 ? 'Select a Player to Add Point!' : 'Add Players to Start!';
    }.property('length'),
    sortPlayers : function() {
    	var sortedPlayers = this.get('content').sort(function(a,b) {
    		return b.get('point') - a.get('point');
    	});
    	this.set('content', []);
    	this.set('content', sortedPlayers);
    }
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
		//this.selectedView.selected_player();
	},
	doubleClick : function (event) {
		this.editSelected();
		event.preventDefault();
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
		//console.log(id);
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

App.addPoint = Em.View.extend({
	tagName : 'a',
	controller : App.playerController,

	click : function() {
		var point = App.playerController.findProperty('isSelected', true).get('point');
		App.playerController.findProperty('isSelected', true).set('point', point+5);
		this.sort_leaderboard();
	},
	sort_leaderboard : function () {
		App.playerController.sortPlayers();
	}
});

