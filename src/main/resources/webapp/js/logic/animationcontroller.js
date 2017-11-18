/**
 * Defines interactions between objects at the scene and animation logic.
 */
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
        /**
         * Flag whether to show the Arrows object.
         */
        isShowArrows: false,
        /**
         * Flag whether to show the intersection plane representing object.
         */
        isShowPlane: false,
        /**
         * Speed of the intersection plane motion, in scene's units per second.
         */
        speed: 0.2,
        /**
         * Factor having values of 1 or -1 to determine direction along the vector of intersection plane motion.
         */
        direction: 1,
        /**
         * Calculated cut of the given mesh with the intersection plane.
         */
        intersectionCut: null,
        /**
         * Flag whether to rotate the intersection cut to create more interesting cuts.
         */
        isRotating: true,
        /**
         * Instance of the class which creates the intersection cut from the calculated intersection points.
         */
        pointProcessor: new PointProcessor(),

        /**
         * Drives animation logic.
         */
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
            var intersectionCutPoints = this.pointProcessor.findIntersections(this.cube, this.intersectingPlane);

            this.pointProcessor.meshMode = this.isShowPlane ? "line" : "solid";

            this.intersectionCut = this.pointProcessor.createConvexPolygon(this.intersectingPlane, intersectionCutPoints);
            this.scene.add(this.intersectionCut);
        },

        /**
         * Sets isShowArrows flag and the arrows visibility.
         */
        setShowArrows: function(value) {
            this.isShowArrows = value;
            this.arrows.getMesh().visible = value;
        },

        /**
         * Sets isShowPlane flag and the plane visibility.
         */
        setShowPlane: function(value) {
            this.isShowPlane = value;
            this.intersectingPlane.getMesh().visible = value;
        }
    };

    return AnimationController;
});