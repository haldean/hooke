;(function(){
var minfigsize = 300;
var tag = "figure";

var k_collision = 40;
var k_fix = 1;
var timestep = 0.01;
var max_iters = 50;

var low_sample_time = 5;
var low_force_threshold = 0.1;

var debug = false;
var animate = false;
var insert_markers = false;

// layout params. should be reset on every layout
var low_samples = 0;

function reset() {
    low_samples = 0;
}

function log(x) {
    // flip to false to turn off logging.
    if (debug) console.log(x);
}

function getpad(node, side) {
    return parseInt($(node).css("padding-" + side))
        + parseInt($(node).css("margin-" + side));
}

function get_initial_state(nodes) {
    var q = [];
    for (var i = 0; i < nodes.length; i++) {
        var n = {};
        var jq = $(nodes[i]);
        n.top = jq.offset().top;
        n.height = jq.height() + getpad(jq, "top") + getpad(jq, "bottom");
        n.fix = n.top;
        n.node = jq;
        n.mass = n.height * jq.width();
        q = q.concat(n);
    }
    return q;
}

function calc_forces(q) {
    var total_overlap = 0;
    for (var i = 0; i < q.length; i++) {
        q[i].force = 0;
    }
    for (var i = 0; i < q.length - 1; i++) {
        var n = q[i];
        var nn = q[i+1];
        if (n.top + n.height >= nn.top) {
            var overlap = n.top + n.height - nn.top;
            total_overlap += overlap;
            n.force -= overlap * k_collision;
            nn.force += overlap * k_collision;
        }
        n.force += (n.fix - n.top) * k_fix;
    }
    q[0].force = 0;
    q[q.length - 1].force = 0;
    return total_overlap;
}

function apply_forces(q) {
    var total_move = 0;
    for (var i = 0; i < q.length; i++) {
        var n = q[i];
        var move = n.force * timestep;
        log("move " + i + " by " + move);
        total_move += Math.abs(move);
        q[i].top += move;
    }
    return total_move / q.length;
}

function apply_locations(q, left) {
    var add_markers = ($(".marker").length == 0) && insert_markers;
    var last_marker_x, last_marker_y;
    for (var i = 0; i < q.length; i++) {
        q[i].node.offset({left: left, top: q[i].top});

        if (add_markers) {
            var m = document.createElement("div");
            m.innerText = "m" + i;
            $(m).css('position', 'absolute');

            var l = left - 15;
            if (q[i].fix == last_marker_y) {
                l = last_marker_x + 30;
            }
            $(m).addClass("marker").offset({left: l, top: q[i].fix});
            last_marker_x = l;
            last_marker_y = q[i].fix;

            $("body").append(m);
        }
    }
}

function done(q, overlap, force) {
    if (force > low_force_threshold) {
        low_samples = 0;
        return false;
    }
    return ++low_samples > low_sample_time;
}

function layout() {
    var figs = document.getElementsByTagName(tag);
    if (!figs.length || document.location.hash == "#nolayout") {
        log("no figures, bailing.");
        return;
    }

    reset();

    if (($(".marker").length == 0) && insert_markers) {
        $("body").append("<style>.marker {" +
                "background-color: red; font-size: 11pt; font-family: sans" +
                "}</style>");
    }

    var wwidth = $(window).width();
    var bwidth = $("body").width();
    var boff = $("body").offset().left;

    var figlpad = getpad(figs[0], "left");
    var figrpad = getpad(figs[0], "right");

    var leftedge = bwidth + boff + Math.max(getpad("body", "right"), figlpad);
    log("left edge at " + leftedge + "px");
    var figwidth = wwidth - leftedge - figrpad;
    if (figwidth < minfigsize) {
        log("only " + figwidth + "px for figures, leaving inline.");
        $(figs).removeAttr("style");
        return;
    }

    $(figs).css("position", "absolute");
    $(figs).css("max-width", figwidth + "px");

    var q = get_initial_state(figs);
    log(q);
    if (!animate) {
        for (var i = 0; i < max_iters; i++) {
            var overlap = calc_forces(q);
            var forces = apply_forces(q);
            if (done(q, overlap, forces)) {
                break;
            }
        }
    } else {
        function frame() {
            var overlap = calc_forces(q);
            var forces = apply_forces(q);
            apply_locations(q, leftedge);
            if (!done(q, overlap, forces)) {
                setTimeout(frame, 100);
            }
        };
        frame();
    }
    log(q);
    apply_locations(q, leftedge);
}

$(document).ready(function() { layout(); setTimeout(layout, 200); });
$(window).resize(layout);
})();
