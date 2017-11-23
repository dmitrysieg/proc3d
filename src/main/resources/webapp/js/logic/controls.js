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
        colors: {
            graph: {r: 0, g: 0, b: 0, a: 255},
            bottom: {r: 30, g: 144, b: 255, a: 180},
            top: {r: 30, g: 144, b: 255, a: 45}
        },
        toStyle: function(color) {
            return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a / 255.0 + ')';
        },
        append: function(element) {
            this.canvas = document.createElement("canvas");
            this.canvas.width = 250;
            this.canvas.height = 250;
            element.appendChild(this.canvas);

            // set clear color
            var ctx = this.canvas.getContext("2d");
            ctx.fillStyle = this.toStyle(this.colors.top);
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            return this;
        },
        drawPoint: function(imageData, x, y, color) {
            var w = this.canvas.width;
            var index = 4 * (y * w + x);
            imageData[index] = color.r;
            imageData[index + 1] = color.g;
            imageData[index + 2] = color.b;
            imageData[index + 3] = color.a;
        },
        drawVLine: function(imageData, x, y1, y2, color) {
            if (y1 == y2) {
                this.drawPoint(imageData, x, y1, this.colors.graph);
                return;
            }
            var dy = y2 > y1 ? 1 : -1;

            var w = this.canvas.width;
            for (var y = y1; y != y2; y += dy) {
                var index = 4 * (y * w + x);
                imageData[index] = color.r;
                imageData[index + 1] = color.g;
                imageData[index + 2] = color.b;
                imageData[index + 3] = color.a;
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
                this.drawPoint(imgData.data, x, y, this.colors.graph);
            } else {
                // todo: rough vertical line to interpolate so far
                this.drawVLine(imgData.data, x, this.prevY, y, this.colors.graph);

                // bottom fill
                var max = this.prevY > y ? this.prevY : y;
                if (max + 1 < this.canvas.height) {
                    this.drawVLine(imgData.data, x, max + 1, this.canvas.height, this.colors.bottom);
                }

                // top fill
                var min = this.prevY < y ? this.prevY : y;
                if (min - 1 > 0) {
                    this.drawVLine(imgData.data, x, 0, min - 1, this.colors.top);
                }
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