var WiredCube = function(x1, y1, z1, x2, y2, z2) {

    this.material = lightLineMaterial;

    this.segments = [
        // altering x
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y1, z1)],
        [new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x2, y1, z2)],
        [new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x2, y2, z1)],
        [new THREE.Vector3(x1, y2, z2), new THREE.Vector3(x2, y2, z2)],

        // altering y
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y2, z1)],
        [new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x1, y2, z2)],
        [new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y2, z1)],
        [new THREE.Vector3(x2, y1, z2), new THREE.Vector3(x2, y2, z2)],

        // altering z
        [new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y1, z2)],
        [new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x1, y2, z2)],
        [new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y1, z2)],
        [new THREE.Vector3(x2, y2, z1), new THREE.Vector3(x2, y2, z2)]
    ];

    this.geometry = new THREE.Geometry();
    for (var i = 0; i < this.segments.length; i++) {
        this.geometry.vertices.push(this.segments[i][0], this.segments[i][1]);
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

        for (var i = 0; i < this.segments.length; i++) {

            var xa = this.segments[i][0].clone().sub(planePoint.clone());
            var projection0 = xa.dot(plane.getNormal().clone());

            var ya = this.segments[i][1].clone().sub(planePoint.clone());
            var projection1 = ya.dot(plane.getNormal().clone());

            // no intersection
            if (projection0 * projection1 > 0) {
                continue;
            }
            // TODO process extreme cases (points laying on the plane)
            var intersectionPoint = this.segments[i][0].clone().add(
                this.segments[i][1].clone().sub(this.segments[i][0].clone()).multiplyScalar(
                    Math.abs(projection0) / (Math.abs(projection0) + Math.abs(projection1))
                )
            );
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