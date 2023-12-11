// Editor and base node code
// Authored by Myles Marr for ART101 - Fall 2023
// :)
// 11/24/2023

// Global declarations

var spawnMode = false;
var mouseX, mouseY;
var selectedNode = null;
var nodes = [];
var nodeCount = 0;
const nodeIdBase = "seagullNode";
// Functions
function Node(
	name,
	desc,
	posx = 0,
	posy = 0,
	size = 32,
	floatX = 0,
	floatY = 0,
	link = window.location.href
) {
	this.id = nodeIdBase + nodeCount++; //id of the node
	this.name = name; //name of the node
	this.desc = desc; //description of the node
	this.posx = posx; //x position of the node
	this.posy = posy; //y position of the node
	this.size = size; //size of the node (width and height)
	this.floatX = floatX; //x offset of the floating info box
	this.floatY = floatY; //y offset of the floating info box
	this.infoWidth = 200; //width of the floating info box
	this.link = link; //link to the reference of data
	this.infoStyle = {
		left: `${this.floatX}px`,
		top: `${this.floatY}px`,
	};
	this.css = {
		left: `${this.posx}px`,
		top: `${this.posy}px`,
		width: `${this.size}px`,
		height: `${this.size}px`,
	};
	//create the element with HTML and set CSS
	this.element = $(`<div id="${this.id}" class="seagullNode">
	<div class="seagullNodeInfo">
	<div class="seagullNodeName">${this.name}</div>
	<div class="seagullNodeDesc">${this.desc}</div>
	</div>
	</div>	`);
	this.element.css(this.css);
	this.element.find(".seagullNodeInfo").css(this.infoStyle);

	//update the node's position and size incase of screen resize
	this.update = function () {
		this.infoStyle = {
			left: `${this.floatX}px`,
			top: `${this.floatY}px`,
		};
		this.css = {
			left: `${this.posx}px`,
			top: `${this.posy}px`,
			width: `${this.size}px`,
			height: `${this.size}px`,
		};
		this.element.css(this.css);
		this.element.find(".seagullNodeInfo").css(this.infoStyle);
	};
	//spawn the node
	this.spawn = function () {
		$("#seagullContainer").append(this.element);
	};
	//onclick function
	this.onClicked = function () {
		if (spawnMode) {
			return;
		}
		//get obj from id
		let nobj = nodes.find((n) => n.id == $(this).attr("id"));
		window.location.href = nobj.link;
	};

	this.element.on("click", this.onClicked);
	this.element.on("mouseenter", function () {
		focusNode($(this).attr("id"));
	});
	this.element.on("touchenter", function () {
		focusNode($(this).attr("id"));
	});
	this.element.on("mouseleave", function () {
		unfocusNodes();
	});
	this.element.on("touchleave", function () {
		unfocusNodes();
	});
}

/**
 *
 * @param {HTMLElement} n
 */
function makeEditable(n) {
	//get node object from array
	let nobj = nodes.find((n1) => n1.id == n.attr("id"));

	if (!nobj) {
		alert("Bad nodes, please remake or check ids");
		return;
	}
	n.removeClass("seagullNode");
	n.addClass("seagullNodeEditable");
	//set opacity
	n.find(".seagullNodeInfo").css("opacity", 1);
	//set draggable
	n.draggable({
		drag: function (event, ui) {
			nobj.posx = ui.position.left;
			nobj.posy = ui.position.top;
			nobj.update();
		},
		distance: 5,
	});

	//set click to select
	n.on("click", function () {
		if ($(this).hasClass("selected")) {
			return;
		}
		$(".selected").trigger("blur");
		$(".selected").removeClass("selected");
		n.addClass("selected");
		selectedNode = nobj;
		console.log("selected: ");
		console.log(selectedNode);
	});
	//set double click to edit
	n.on("dblclick", function () {
		//TODO make dbl click focus on target
		n.draggable("disable");
		//set contenteditable
		n.find(".seagullNodeName").attr("contenteditable", true);
		n.find(".seagullNodeDesc").attr("contenteditable", true);
		n.find(".seagullNodeName").focus();
	});
	//set blur to save
	n.on("blur", function () {
		//set contenteditable
		n.find(".seagullNodeName").attr("contenteditable", false);
		n.find(".seagullNodeDesc").attr("contenteditable", false);
		//update node
		n.name = n.find(".seagullNodeName").text();
		n.desc = n.find(".seagullNodeDesc").text();
		n.draggable("enable");
	});
}

/**
 * Prompts to download a file with given params
 * @param {string} text
 * @param {string} name
 * @param {test} type
 * @author https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
 * @returns {null}
 */
function download(data, filename, type) {
	var file = new Blob([data], { type: type });
	if (window.navigator.msSaveOrOpenBlob)
		// IE10+
		window.navigator.msSaveOrOpenBlob(file, filename);
	else {
		// Others
		var a = document.createElement("a"),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(function () {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function spawnEditableNode() {
	var n = new Node("Node", "Description", mouseX - 64, mouseY - 16, 24, 0, 0);
	nodes.push(n);
	n.spawn();
	makeEditable(n.element);
}

function loadNodes(nodeJSON) {
	nodes = [];
	for (var i = 0; i < nodeJSON.length; i++) {
		var n = new Node(
			nodeJSON[i].name,
			nodeJSON[i].desc,
			nodeJSON[i].posx,
			nodeJSON[i].posy,
			nodeJSON[i].size,
			nodeJSON[i].floatX,
			nodeJSON[i].floatY,
			nodeJSON[i].link
		);
		n.spawn();
		nodes.push(n);
	}
	nodeCount = nodes.length;
}

/**
 * Toggles spawn mode on and off, when toggled back off, prompts to save the json output for all nodes
 * @returns {null}
 */
function spawnModeToggle() {
	spawnMode = !spawnMode;
	if (spawnMode) {
		//attach event listener to the container
		$(document).on("mousemove", function (event) {
			mouseX = event.pageX;
			mouseY = event.pageY;
		});
		// add key listeners to everything but editable nodes
		$(document).on("keyup", function (event) {
			if (event.target.isContentEditable) {
				return;
			}
			// ON DELETE
			if (event.keyCode == 46) {
				var selectedNode = nodes.find((n) => n.id == $(".selected").attr("id"));
				if (!selectedNode) {
					return;
				}
				selectedNode.element.remove();
				nodes = nodes.filter((n) => n.id != selectedNode.id);
				selectedNode = null;
			}
			// ON PRESS TILDA
			if (event.keyCode == 192) {
				spawnEditableNode();
			}
			//ON ARROW KEY PRESS
			if (
				event.keyCode == 38 ||
				event.keyCode == 37 ||
				event.keyCode == 40 ||
				event.keyCode == 39
			) {
				var selectedNode = nodes.find((n) => n.id == $(".selected").attr("id"));
				if (!selectedNode) {
					return;
				}
				const fl = 10;
				if (event.keyCode == 38) {
					selectedNode.floatY -= fl;
				} else if (event.keyCode == 37) {
					selectedNode.floatX -= fl;
				} else if (event.keyCode == 40) {
					selectedNode.floatY += fl;
				} else if (event.keyCode == 39) {
					selectedNode.floatX += fl;
				}
				selectedNode.update();
			}
		});
		$("#seagullContainer").on("click", function (event) {
			if (event.target == $(this)[0]) {
				$(".selected").removeClass("selected");
				selectedNode = null;
				$("#seagullContainer").children().trigger("blur");
				console.log("deselecting");
			}
		});
		$("#seagullContainer").on("dblclick", function (event) {
			if (event.target == $(this)[0]) {
				spawnEditableNode();
			}
		});
		//change all nodes to editable
		$(".seagullNode").each(function () {
			console.log($(this));
			let n = $(this);
			makeEditable(n);
		});

		console.log("Spawn mode on");
	} else {
		//detach event listeners
		$(document).off("mousemove");
		$(document).off("keyup");
		$("#seagullContainer").off("click");
		$("#seagullContainer").off("dblclick");
		//collect all nodes
		for (var i = 0; i < nodes.length; i++) {
			delete nodes[i].update;
			delete nodes[i].spawn;
			nodes[i].name = nodes[i].element.find(".seagullNodeName").text();
			nodes[i].desc = nodes[i].element.find(".seagullNodeDesc").text();
			delete nodes[i].element;
			delete nodes[i].onClicked;
			delete nodes[i].css;
			delete nodes[i].infoStyle;
		}
		download(JSON.stringify(nodes), "nodes.json", "application/json");
		console.log(nodes);
		console.log("Spawn mode off");
	}
}
