define(function() {

    var Proc3DControls = function(animationController) {

        this.animationController = animationController;

        this.checkBox1 = document.createElement("input");
        this.checkBox1.id = "checkbox1";
        this.checkBox1.type = "checkbox";
        this.checkBox1.value = "unchecked";

        this.label1 = document.createElement("label");
        this.label1['for'] = "checkbox1";
        this.label1.innerHTML = "Show arrows";

        this.checkBox2 = document.createElement("input");
        this.checkBox2.id = "checkbox2";
        this.checkBox2.type = "checkbox";
        this.checkBox2.value = "unchecked";

        this.label2 = document.createElement("label");
        this.label2['for'] = "checkbox2";
        this.label2.innerHTML = "Show plane";
    };

    Proc3DControls.prototype = {
        append: function(element) {
            element.appendChild(this.checkBox1);
            this.checkBox1.onclick = this.createDelegate(this.checkBox1onclick, this);
            element.appendChild(this.label1);

            element.appendChild(document.createElement("br"));

            element.appendChild(this.checkBox2);
            this.checkBox2.onclick = this.createDelegate(this.checkBox2onclick, this);
            element.appendChild(this.label2);
            return this;
        },
        checkBox1onclick: function() {
            this.animationController.setShowArrows(!this.animationController.isShowArrows);
        },
        checkBox2onclick: function() {
            this.animationController.setShowPlane(!this.animationController.isShowPlane);
        },
        createDelegate: function(fn, scope) {
            return function() {
                return fn.apply(scope, arguments);
            }
        }
    };

    return Proc3DControls;
});