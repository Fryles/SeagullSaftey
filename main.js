// Main javascript file for the infographic
// Group 2 - ART101 - Fall 2023
// 11/24/2023

function Node(name, desc, posx = 0, posy = 0, size = 24, float = "down") {
	this.name = name;
	this.desc = desc;
	this.posx = posx;
	this.posy = posy;
	this.size = size;
	this.float = float;
	this.css = `
	top: ${posy}px;
	left: ${posx}px;
	width: ${size}px;
	height: ${size}px;
	`;
	this.element = $(`<div class="seagullNode" style="${this.css}">
	<div class="seagullNodeInfo ${this.float}">
	<div class="seagullNodeName">${this.name}</div>
	<div class="seagullNodeDesc">${this.desc}</div>
	</div>
	</div>	`);
	this.update = function () {
		this.element.css(this.css);
		this.element.find(".seagullNodeName").text(this.name);
		this.element.find(".seagullNodeDesc").text(this.desc);
	};
	this.spawn = function () {
		$("#seagullContainer").append(this.element);
	};
}

new Node(
	"Seagull",
	"A seagull is a bird that lives near the ocean.",
	100,
	100,
	32
).spawn();

function spawnModeToggle() {}
