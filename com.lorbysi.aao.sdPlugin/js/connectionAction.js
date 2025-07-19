function ConnectionAction(inContext, inSettings) {
    // Init Action
    var instance = this;
	
	inSettings["repeatAction"] = '0';

    // Private variable containing the context of the action
    var context = inContext;

    var settings = inSettings;

    // Public function returning the context
    this.getContext = function() {
        return context;
    };
    // Public function returning the settings
    this.getSettings = function() {
        return settings;
    };

    // Public function for settings the settings
    this.setSettings = function(inSettings) {
        settings = inSettings;
    };
	
	
	this.getSimVars = function(){
		var allVars = [];
		return allVars;
	}
	
	this.onUpdate = function(){
	}

    this.onKeyDown = function(inContext, inSettings, inCoordinates, inUserDesiredState, inState) {
    };
	
	var titleString = "";
	
	this.getTitle = function() 
	{
		return titleString;
	};
	
	this.setTitle = function(inTitleStr) 
	{
		titleString = inTitleStr;
	};
}
