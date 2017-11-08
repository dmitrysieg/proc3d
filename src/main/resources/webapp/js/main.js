var scene, camera, renderer;

var darkLineMaterial = new THREE.LineBasicMaterial({linewidth: 10, color: 0x333333, transparent: true});
var lightLineMaterial = new THREE.LineBasicMaterial({linewidth: 2, color: 0x333333, opacity: 0.25, transparent: true});

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
};

WiredCube.prototype = {
    addToScene: function(scene) {
        scene.add(this.line);
    }
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

    var light = new THREE.PointLight(0xffffff);
    light.position.set(-100, 200, 100);
    scene.add(light);



    var cube = new WiredCube(0, 0, 0, 1, 1, 1);
    cube.addToScene(scene);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.center = new THREE.Vector3(0.5, 0.5, 0.5);
}


function animate() {

  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();

}