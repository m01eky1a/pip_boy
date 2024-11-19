<template>
	<div class="led-container">
		<div class="led-display">
			<div class="scrolling-text">{{ text }}</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "PageHome",
	data() {
		return {
			text: "GODS OF ROADS ",
		};
	},
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Pixelify+Sans:wght@400..700&display=swap");
.led-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #1f1e1e;
	box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 0, 0, 0.5),
		0 0 100px 20px rgba(0, 0, 0, 0.8);
	background: radial-gradient(
			ellipse at center,
			rgba(0, 0, 0, 0.6),
			transparent 70%
		),
		rgba(31, 30, 30, 1);
	transform: scale(1.05);
	transform-origin: center;
}

.led-container::before {
	content: "";
	position: absolute;
	top: -10%;
	left: -10%;
	width: 120%;
	height: 120%;
	pointer-events: none;
	background: radial-gradient(
		ellipse at center,
		rgba(0, 0, 0, 0.3),
		transparent 70%
	);
	transform: translateZ(0);

	/* Добавляем шум */
	background-image: url("@/assets/noise4.gif");
	background-repeat: repeat;
	opacity: 0.01;
}

.led-container::after {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	background: repeating-linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0),
		rgba(0, 0, 0, 0) 1px,
		rgba(0, 0, 0, 0.1) 1px,
		rgba(0, 0, 0, 0.1) 2px
	);
	z-index: 2;
}

.led-display {
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
}

.scrolling-text {
	display: inline-block;
	color: red;
	font-size: 10rem;
	font-family: "Pixelify Sans", serif;
	letter-spacing: 5px;
	animation: scroll-text 8s linear infinite;
}

/* Анимация бегущей строки */
@keyframes scroll-text {
	0% {
		transform: translateX(200%);
	}
	100% {
		transform: translateX(-100%);
	}
}
</style>
