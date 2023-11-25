// Main javascript file for the infographic
// Group 2 - ART101 - Fall 2023
// 11/24/2023

// Global variables

mobile = false;
// the nodes array has been declared in editor.js


/**
 * This function updates the global media query variable
 */
function checkPosition() {
	if (window.matchMedia('(max-width: 700px)').matches && !mobile) {
		//if we're mobile and we weren't before
		mobile = true;
		for (var i = 0; i < nodes.length; i++) {
			mobileNodeAdjustment(nodes[i]);
		}
	} else if(mobile && !window.matchMedia('(max-width: 700px)').matches) {
		//if we were mobile and now we're not
		mobile = false;
		for (var i = 0; i < nodes.length; i++) {
			mobileNodeAdjustment(nodes[i]);
		}
	}
}
// Set event listener for media queries
window.addEventListener('resize', checkPosition);

// Mobile node adjustment
function mobileNodeAdjustment(node) {
	if (mobile) {
		node.posx = node.posx * 390/700
		node.posy = node.posy * 390/700
		node.posy = node.posy + 40;
	} else {
		node.posy = node.posy - 40;
		node.posx = node.posx * 700/390
		node.posy = node.posy * 700/390
	}
	node.update();
}


// MAIN

//get json from file
$.getJSON("nodes.json", function (data) {
	console.log(data);
	loadNodes(data);
	checkPosition();
});