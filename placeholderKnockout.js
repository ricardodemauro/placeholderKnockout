(function($){
	ko.changedFlag = function(root) {
	    var result = function() {};
	    var initialState = ko.observable(ko.toJSON(root));
	    result.isChanged = ko.computed(function() {
	        var changed = initialState() !== ko.toJSON(root);
	        if (changed) result.reset();
	        return changed;
	    }).extend({ notify: 'always' });
	    result.reset = function() {
	        initialState(ko.toJSON(root));
	    };
	    return result;
	};
	
	$.fn.placeholderKnockout = function(opts){
		var self = this;
		var __opts = $.extend({ 
			viewModel: new Object()
		}, opts );
		function setViewModelAware(viewModel, callback){
			viewModel.changedFlag = new ko.changedFlag(viewModel);
			viewModel.changedFlag.isChanged.subscribe(function(isChanged) {
			    if (isChanged) {
			    	LF.UI.Util.View.Log("model changed");
				    callback.apply(self);
			    }
			});
            return this;
		};
		function updatedHandler(element, event){
			$(self).find('input[placeholderNockout]').each(function(){
				$(this).parent().toggleClass('placeholder-changed', this.value !== '');
			});	
            return self;
		};
		function initPlaceholder() {
			$(this).find('input[placeholder]').bind({
			    focus: function(){
			        $(this).parent().addClass('placeholder-focus');
			    },blur: function(){
			        $(this).parent().removeClass('placeholder-focus');
			    },'keyup input paste change input': function(){
			        $(this).parent().toggleClass('placeholder-changed', this.value !== '');
			    }
			}).each(function(i, elem){
			    var $this = $(elem);
			    $this.attr('placeholderNockout', 'placeholderNockout');
			    if(!this.id) this.id='ph_' + (i); 
			    $('<span class="placeholderWrap"><label for="' + this.id + '">' + $this.attr('placeholder') + '</label></span>')
			    .insertAfter($this)
			    .append($this); 
			    $this.removeAttr('placeholder');
			});
            return this;
		}
		setViewModelAware(__opts.viewModel, updatedHandler).setTimeout(function(){
			initPlaceholder.apply(self)
		}, 100);
		return this;
	};
})(jQuery);
