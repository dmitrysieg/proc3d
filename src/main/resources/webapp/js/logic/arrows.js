var Arrows = function(plane) {

    var axer = plane.getAxer();

    var dir1 = plane.getNormal().clone();
    var dir2 = new THREE.Vector3(1.0, 0.0, 0.0).applyQuaternion(axer);
    var dir3 = new THREE.Vector3(0.0, 1.0, 0.0).applyQuaternion(axer);

    var arrow1 = new THREE.ArrowHelper(
        dir1,
        plane.getPosition(),
        1,
        0xFF0000
    );

    var arrow2 = new THREE.ArrowHelper(
        dir2,
        plane.getPosition(),
        1,
        0xFFF000
    );

    var arrow3 = new THREE.ArrowHelper(
        dir3,
        plane.getPosition(),
        1,
        0xFFFF00
    );

    var group = new THREE.Group();
    group.add(arrow1);
    group.add(arrow2);
    group.add(arrow3);

    return group;
};