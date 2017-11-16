define([
    'lib/three.min',
    'logic/pointprocessor'
], function(THREE, PointProcessor) {

    var AnimationController = function(clock, scene, cube, intersectingPlane, arrows) {
        this.clock = clock;
        this.scene = scene;
        this.cube = cube;
        this.intersectingPlane = intersectingPlane;
        this.arrows = arrows;
    };

    AnimationController.prototype = {
        isShowArrows: false,
        isShowPlane: false,
        speed: 0.2,
        direction: 1,
        intersectionCut: null,
        isRotating: true,
        pointProcessor: new PointProcessor(),
        animate: function() {

            var delta = this.clock.getDelta();
            var dx = delta * this.speed * this.direction;

            var position = this.intersectingPlane.getPosition();
            position.addScalar(dx);
            if (position.x > 1.0 - 0.05) {
                position.setScalar(1.0 - 0.05);
                this.direction = -this.direction;
            } else if (position.x < 0.0 + 0.05) {
                position.setScalar(0.0 + 0.05);
                this.direction = -this.direction;
            }

            // transforming intersecting plane
            this.intersectingPlane.setPosition(position);
            if (this.isRotating) {
                this.intersectingPlane.rotate(0.005);
            }

            // transforming intersecting plane
            if (this.isShowArrows) {
                var axer = this.intersectingPlane.getAxer(this.arrows.axis1);
                this.arrows.rotate(axer);
                this.arrows.move(this.intersectingPlane.position);
            }

            // transforming intersection cut
            if (this.intersectionCut) {
                this.scene.remove(this.intersectionCut);
            }
            var intersectionCutPoints = this.cube.findIntersections(this.intersectingPlane);

            this.pointProcessor.meshMode = this.isShowPlane ? "line" : "solid";

            this.intersectionCut = this.pointProcessor.processPoints(this.intersectingPlane, intersectionCutPoints);
            this.scene.add(this.intersectionCut);
        },
        setShowArrows: function(value) {
            this.isShowArrows = value;
            this.arrows.getMesh().visible = value;
        },
        setShowPlane: function(value) {
            this.isShowPlane = value;
            this.intersectingPlane.getMesh().visible = value;
        }
    };

    return AnimationController;
});