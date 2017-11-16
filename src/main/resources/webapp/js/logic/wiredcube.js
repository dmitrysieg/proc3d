define([
    'lib/three.min',
    'logic/pointprocessor'
], function(THREE, PointProcessor) {

    var WiredCube = function(x1, y1, z1, x2, y2, z2) {

        this.material = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

        this.vertices = [
            new THREE.Vector3(x1, y1, z1),
            new THREE.Vector3(x1, y1, z2),
            new THREE.Vector3(x1, y2, z1),
            new THREE.Vector3(x1, y2, z2),
            new THREE.Vector3(x2, y1, z1),
            new THREE.Vector3(x2, y1, z2),
            new THREE.Vector3(x2, y2, z1),
            new THREE.Vector3(x2, y2, z2)
        ];

        this.segments = [
            // altering x
            [0, 4],
            [1, 5],
            [2, 6],
            [3, 7],

            // altering y
            [0, 2],
            [1, 3],
            [4, 6],
            [5, 7],

            // altering z
            [0, 1],
            [2, 3],
            [4, 5],
            [6, 7]
        ];

        this.geometry = new THREE.Geometry();
        for (var i = 0; i < this.segments.length; i++) {
            var vertex0 = this.vertices[this.segments[i][0]];
            var vertex1 = this.vertices[this.segments[i][1]];
            this.geometry.vertices.push(vertex0, vertex1);
        }

        this.mesh = new THREE.LineSegments(this.geometry, this.material);
        return this;
    };

    WiredCube.prototype = {
        /**
         * Find intersection of a set of line segments with a given plane.
         * Return a mesh ready to be added to a scene.
         */
        findIntersections: function(plane) {

            var planePoint = plane.getPosition();

            var intersectionPoints = [];

            // caching calculations for vertices
            var projections = [];
            for (var i = 0; i < this.vertices.length; i++) {
                var distanceToPlanePoint = this.vertices[i].clone().sub(planePoint);
                var projection = distanceToPlanePoint.dot(plane.getNormal());
                projections.push(projection);
            }

            for (var i = 0; i < this.segments.length; i++) {

                var projection0 = projections[this.segments[i][0]];
                var projection1 = projections[this.segments[i][1]];

                // no intersection
                if (projection0 * projection1 > 0) {
                    continue;
                }
                // TODO process extreme cases (points laying on the plane)
                var ratio = Math.abs(projection0) / (Math.abs(projection0) + Math.abs(projection1));

                var vertex0 = this.vertices[this.segments[i][0]].clone();
                var vertex1 = this.vertices[this.segments[i][1]].clone();

                var direction = vertex1.sub(vertex0).multiplyScalar(ratio);
                var intersectionPoint = vertex0.add(direction);
                intersectionPoints.push(intersectionPoint);
            }

            if (intersectionPoints.length > 0) {
                return new PointProcessor().processPoints(plane, intersectionPoints);
            } else {
                return null;
            }
        },
        getMesh: function() {
            return this.mesh;
        }
    };

    return WiredCube;
});