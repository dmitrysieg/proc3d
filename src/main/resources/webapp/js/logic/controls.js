define(function() {

    function createEl(tag, values) {
        var el = document.createElement(tag);
        for (var key in values) {
            el[key] = values[key];
        }
        return el;
    }

    var UIControls = function(animationController) {

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

    UIControls.prototype = {
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

    var UIGraph = function(size) {
        this.prevY = null;
    };

    UIGraph.prototype = {
        append: function(element) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = 250;
            this.canvas.height = 250;
            element.appendChild(this.canvas);
            return this;
        },
        drawPoint: function(imageData, x, y) {
            var w = this.canvas.width;
            var index = 4 * (y * w + x);
            imageData[index] = 0;
            imageData[index + 1] = 0;
            imageData[index + 2] = 0;
            imageData[index + 3] = 255;
        },
        drawVLine: function(imageData, x, y1, y2) {
            if (y1 == y2) {
                this.drawPoint(imageData, x, y1);
                return;
            }
            var dy = y2 > y1 ? 1 : -1;

            var w = this.canvas.width;
            for (var y = y1; y != y2; y += dy) {
                var index = 4 * (y * w + x);
                imageData[index] = 0;
                imageData[index + 1] = 0;
                imageData[index + 2] = 0;
                imageData[index + 3] = 255;
            }
        },
        /**
         * @value should be normalized to [0, 1].
         */
        update: function(value) {
            var ctx = this.canvas.getContext("2d");
            var imgData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

            var x = Math.round(this.canvas.width * 0.5);
            var y = Math.round(this.canvas.height * (1.0 - value));
            if (this.prevY == null) {
                // draw a point
                this.drawPoint(imgData.data, x, y);
            } else {
                // todo: rough vertical line to interpolate so far
                this.drawVLine(imgData.data, x, this.prevY, y);
            }
            this.prevY = y;
            ctx.putImageData(imgData, -1, 0);
        }
    };

    return {
        UIControls: UIControls,
        UIGraph: UIGraph
    }
});