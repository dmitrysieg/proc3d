/**
 * Class for geometry functional.
 */
define([
    'lib/three.min'
], function(THREE) {

    var GeometryProcessor = function() {};

    GeometryProcessor.prototype = {

        /**
         * Material used for drawing the cut mesh itself.
         */
        solidMaterial: new THREE.MeshPhongMaterial({
            color: 0xEE33EE,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        }),

        lineMaterial: new THREE.LineBasicMaterial({
        	color: 0xEE33EE
        }),

        /**
         * Material used for drawing labels for the cut mesh points.
         */
        cutLabelMaterial: new THREE.MeshBasicMaterial({
            color: 0xEE33EE,
            wireframe: true
        }),

        meshMode: "solid",

        /**
         * Create a cut mesh point label, based on data used while drawing cut mesh.
         * @param points Array of the cut shape points.
         * @param angles Array of calculated angles of the cut shape points relatively to the cut plane.
         * @param i Current point index in the drawing cycle.
         */
        createCutLabel: function(points, angles, i) {
            var label = new THREE.Mesh(
                new THREE.TextGeometry(i + ',' + angles[i], {font: font, size: 0.05, height: 0.01, curveSegments: 2}),
                this.cutLabelMaterial
            );
            label.geometry.computeBoundingBox();

            var offset = points[i].clone().add(new THREE.Vector3(
                -0.5 * (label.geometry.boundingBox.max.x - label.geometry.boundingBox.min.x),
                -0.5 * (label.geometry.boundingBox.max.y - label.geometry.boundingBox.min.y),
                -0.5 * (label.geometry.boundingBox.max.z - label.geometry.boundingBox.min.z)
            ));

            label.position.copy(offset);
            return label;
        },

        /**
         * Flag to draw or not to draw cut points labels.
         */
        isDrawCutLabels: false,

        /**
         * Find intersection of a set of line segments with a given plane.
         * Return a set of points to be consumed by @createConvexPolygon.
         * @param geometry: should contain:
         * * vertices: array of THREE.Vector3 representing vertices.
         * * segments: array of 2 indices of vertices.
         */
        findIntersections: function(geometry, plane) {

            var planePoint = plane.getPosition();

            var intersectionPoints = [];

            // caching calculations for vertices
            var projections = [];
            for (var i = 0; i < geometry.vertices.length; i++) {
                var distanceToPlanePoint = geometry.vertices[i].clone().sub(planePoint);
                var projection = distanceToPlanePoint.dot(plane.getNormal());
                projections.push(projection);
            }

            for (var i = 0; i < geometry.segments.length; i++) {

                var projection0 = projections[geometry.segments[i][0]];
                var projection1 = projections[geometry.segments[i][1]];

                // no intersection
                if (projection0 * projection1 > 0) {
                    continue;
                }
                // TODO process extreme cases (points laying on the plane)
                var ratio = Math.abs(projection0) / (Math.abs(projection0) + Math.abs(projection1));

                var vertex0 = geometry.vertices[geometry.segments[i][0]].clone();
                var vertex1 = geometry.vertices[geometry.segments[i][1]].clone();

                var direction = vertex1.sub(vertex0).multiplyScalar(ratio);
                var intersectionPoint = vertex0.add(direction);
                intersectionPoints.push(intersectionPoint);
            }

            return intersectionPoints;
        },

        /**
         * Consume a set of randomly located points.
         * Transform them into fan-triangulated shape mesh.
         * @param points Non-empty array of Vector3.
         * Contract: points order is not guaranteed, so the method should perform sorting of them.
         */
        createConvexPolygon: function(plane, points) {

            var group = new THREE.Group();
            var area = 0.0;

            // not enough points - empty object to render
            if (points.length < 3) {
                // todo dirty
                return {area: area, group: group};
            }

            var angles = this.sortPoints(plane, points)

            var geometry = new THREE.Geometry();
            for (var i = 0; i < points.length; i++) {
                geometry.vertices.push(points[i]);
                if (this.isDrawCutLabels) {
                    group.add(this.createCutLabel(points, angles, i));
                }
            }

            // lock the mesh mode
            var meshMode = this.meshMode;
            var mesh;
            if (meshMode == "solid") {
                for (var i = 0; i < points.length - 2; i++) {
                    geometry.faces.push(new THREE.Face3(0, 1 + i, 2 + i, plane.getNormal().clone()));

                    var a = geometry.vertices[0].clone().sub(geometry.vertices[1 + i]);
                    var b = geometry.vertices[0].clone().sub(geometry.vertices[2 + i]);
                    var areaVector = new THREE.Vector3().crossVectors(a, b);
                    area += 0.5 * areaVector.length();
                }
                mesh = new THREE.Mesh(geometry, this.solidMaterial);
            } else {
                // add ending vertex for Line
                geometry.vertices.push(geometry.vertices[0]);
                mesh = new THREE.Line(geometry, this.lineMaterial);
            }

            group.add(mesh);
            return {area: area, group: group};
        },
        /**
         * Sort points in the order going by round around a particular point.
         */
        sortPoints: function(plane, points) {
            var angles = [];

            var planifier = plane.getPlanifier();

            // calculating polar angles
            for (var i = 0; i < points.length; i++) {

                // projection of the point to the plane, resulting to have redundant z coordinate
                var rel = points[i].clone().sub(plane.getPosition());
                rel.applyQuaternion(planifier);

                // TODO! handle division by zero case
                var angle = Math.atan(rel.y / rel.x);
                // js Math.atan supports only [-pi/2; pi/2] values
                if (rel.x <= 0) {
                    angle += Math.PI;
                }
                angles.push(angle);
            }

            // Bubble!
            for (var j = 1; j <= points.length - 1; j++) {
                var order = true;
                for (var i = 0; i <= points.length - j; i++) {
                    if (angles[i] > angles[i+1]) {
                        // swapping angles & points
                        var tmp = angles[i];
                        angles[i] = angles[i+1];
                        angles[i+1] = tmp;

                        tmp = points[i];
                        points[i] = points[i+1];
                        points[i+1] = tmp;

                        order = false;
                    }
                }
                if (order) {
                    break;
                }
            }
            // for debug purposes
            return angles;
        }
    };

    return GeometryProcessor;
});