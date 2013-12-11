(function ($) {
    $.fn.placeholderKnockout = function (opts) {
        var self = this;
        var __opts = $.extend({
            viewModel: new Object()
        }, opts);

        ko.changedFlag = function (root) {
            var result = function () { };
            var initialState = ko.observable(ko.toJSON(root));

            result.isChanged = ko.computed(function () {
                var changed = initialState() !== ko.toJSON(root);
                if (changed) result.reset();
                return changed;
            });

            result.reset = function () {
                initialState(ko.toJSON(root));
            };

            return result;
        };

        setViewModelAware(__opts.viewModel, updatedHandler);

        function setViewModelAware(viewModel, callback) {
            viewModel.changedFlag = new ko.changedFlag(viewModel);

            viewModel.changedFlag.isChanged.subscribe(function (isChanged) {
                if (isChanged) {
                    LF.UI.Util.View.Log("model changed");
                    setTimeout(function () {
                        callback.apply(self)
                    }, 100);
                }
            });
        };

        function updatedHandler(element, event) {
            $(self).find('input[placeholderNockout]').each(function () {
                $(this).parent().toggleClass('placeholder-changed', this.value !== '');
            });
            return this;
        };

        setTimeout(function () {
            initPlaceholder.apply(self)
        }, 100);

        function initPlaceholder() {
            $(this).find('input[placeholder]').bind({
                focus: function () {
                    $(this).parent().addClass('placeholder-focus');
                }, blur: function () {
                    $(this).parent().removeClass('placeholder-focus');
                }, 'keyup input paste change input': function () {
                    $(this).parent().toggleClass('placeholder-changed', this.value !== '');
                }
            }).each(function (i, elem) {
                var $this = $(elem);
                $this.attr('placeholderNockout', 'placeholderNockout');
                if (!this.id) this.id = 'ph_' + (i);
                $('<span class="placeholderWrap"><label for="' + this.id + '">' + $this.attr('placeholder') + '</label></span>')
			    .insertAfter($this)
			    .append($this);
                $this.removeAttr('placeholder');
            });
        }
        return this;
    };
})(jQuery);
