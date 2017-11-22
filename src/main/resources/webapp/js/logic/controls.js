define(function() {

    function createEl(tag, values) {
        var el = document.createElement(tag);
        for (var key in values) {
            el[key] = values[key];
        }
        return el;
    }

    var Proc3DControls = function(animationController) {

        this.animationController = animationController;

        this.controls = [{
            checkBox: createEl("input", {id: "checkbox1", type: "checkbox", value: "unchecked"}),
            label: createEl("label", {"for": "checkbox1", innerHTML: "Show arrows"}),
            handler: function() {this.animationController.setShowArrows(!this.animationController.isShowArrows);}
        }, {
            checkBox: createEl("input", {id: "checkbox2", type: "checkbox", value: "unchecked"}),
            label: createEl("label", {"for": "checkbox2", innerHTML: "Show plane"}),
            handler: function() {this.animationController.setShowPlane(!this.animationController.isShowPlane);}
        }];
    };

    Proc3DControls.prototype = {
        append: function(element) {
            for (var i = 0; i < this.controls.length; i++) {
                var control = this.controls[i];

                element.appendChild(control.checkBox);
                element.appendChild(control.label);
                control.checkBox.onclick = this.createDelegate(control.handler, this);

                if (i < this.controls.length - 1) {
                    element.appendChild(document.createElement("br"));
                }
            }
            return this;
        },
        createDelegate: function(fn, scope) {
            return function() {
                return fn.apply(scope, arguments);
            }
        }
    };

    return Proc3DControls;
});