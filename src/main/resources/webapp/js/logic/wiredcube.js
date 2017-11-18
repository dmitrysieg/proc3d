define([
    'lib/three.min'
], function(THREE) {

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
        getMesh: function() {
            return this.mesh;
        }
    };

    return WiredCube;
});