var scene, camera, renderer;

var darkLineMaterial = new THREE.LineBasicMaterial({linewidth: 10, color: 0x333333, transparent: true});
var lightLineMaterial = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

var center = new THREE.Vector3(0.5, 0.5, 0.5);
var nb = new THREE.Vector3(-Math.sqrt(6.0) / 6.0, Math.sqrt(6.0) / 3.0, -Math.sqrt(6.0) / 6.0);
var nc = new THREE.Vector3(-Math.sqrt(2.0) / 2.0, 0.0, Math.sqrt(2.0) / 2.0);

/**
 * Visualizing intersection of a cube with a diagonal moving plane.
 * Plane specifics:
 * * Normal: [sqrt(3) / 3; sqrt(3) / 3; sqrt(3) / 3] ^ T.
 * * Inline point: [l; l; l] ^ T.
 *
 * The problem is to find intersections between the plane and the cube's edges.
 *
 */

var createArrows = function () {

    var dir1 = new THREE.Vector3(1, 1, 1);
    dir1.normalize();
    var dir2 = nb.clone();
    var dir3 = nc.clone();

    var arrow1 = new THREE.ArrowHelper(
        dir1,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFF0000
    );

    var arrow2 = new THREE.ArrowHelper(
        dir2,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFFF000
    );

    var arrow3 = new THREE.ArrowHelper(
        dir3,
        new THREE.Vector3(0.5, 0.5, 0.5),
        1,
        0xFFFF00
    );

    var group = new THREE.Group();
    group.add(arrow1);
    group.add(arrow2);
    group.add(arrow3);

    return group;
};

var WiredCube = function(x1, y1, z1, x2, y2, z2) {

    this.material = lightLineMaterial;

    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push(
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y1, z1),
        new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x2, y1, z2),
        new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x2, y2, z1),
        new THREE.Vector3(x1, y2, z2), new THREE.Vector3(x2, y2, z2),

        // altering y
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y2, z1),
        new THREE.Vector3(x1, y1, z2), new THREE.Vector3(x1, y2, z2),
        new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y2, z1),
        new THREE.Vector3(x2, y1, z2), new THREE.Vector3(x2, y2, z2),

        // altering z
        new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x1, y1, z2),
        new THREE.Vector3(x1, y2, z1), new THREE.Vector3(x1, y2, z2),
        new THREE.Vector3(x2, y1, z1), new THREE.Vector3(x2, y1, z2),
        new THREE.Vector3(x2, y2, z1), new THREE.Vector3(x2, y2, z2),
    );

    this.line = new THREE.LineSegments(this.geometry, this.material);
    return this.line;
};

var IntersectingPlane = function() {

    var material = new THREE.MeshPhongMaterial({
        color: 0x33EE33,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
    })

    /*var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0, 2);
    shape.lineTo(2, 2);
    shape.lineTo(2, 0);
    shape.lineTo(0, 0);*/
    var geometry0 = new THREE.Geometry();

    var p0 = center.clone().add(nb).add(nc);
    var p1 = center.clone().add(nb.clone().negate()).add(nc);
    var p2 = center.clone().add(nb).add(nc.clone().negate());
    var p3 = center.clone().add(nb.clone().negate()).add(nc.clone().negate());

    geometry0.vertices.push(p0, p1, p2, p3);
    var line = new THREE.Line(geometry0, material);
    return line;

    //var geometry = new THREE.ShapeBufferGeometry(shape);

    /*var mesh = new THREE.Mesh(geometry0, material);
    mesh.position.set(0, 0, 0);
    mesh.rotation.set(0.785, 0.785, 0);
    return mesh;*/
};

init();
animate();

function init() {

    scene = new THREE.Scene();
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    renderer = new THREE.WebGLRenderer({
        antialias:true
    });
    renderer.setSize(WIDTH, HEIGHT);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 20000);
    camera.position.set(1.7, 2.2, 2.05);
    scene.add(camera);

    window.addEventListener('resize', function() {
        var WIDTH = window.innerWidth,
            HEIGHT = window.innerHeight;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    });

    renderer.setClearColor(0xEEEEEE, 1);

    var light1 = new THREE.PointLight(0xffffff);
    light1.position.set(-100, 200, 100);
    scene.add(light1);

    var light2 = new THREE.PointLight(0xffffff);
    light2.position.set(100, -200, -100);
    scene.add(light2);

    scene.add(new WiredCube(0, 0, 0, 1, 1, 1));
    scene.add(createArrows());
    scene.add(new IntersectingPlane());

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.center = new THREE.Vector3(0.5, 0.5, 0.5);
}


function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
}