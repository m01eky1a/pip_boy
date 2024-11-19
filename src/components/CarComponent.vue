<template>
	<div @keydown="handleKeyPress" tabindex="0">
		<!-- Текст "GODS OF ROADS" -->
		<div v-show="currentIndex === -1" class="led-container">
			<div class="led-display">
				<div class="scrolling-text">{{ text }}</div>
			</div>
		</div>

		<!-- Контент машин -->
		<div v-show="currentIndex !== -1" class="page">
			<h1 class="car-title" ref="typingText"></h1>
			<div class="content">
				<figure class="image-container">
					<img :src="currentCar.imageUrl" alt="Car Image" />
				</figure>
				<section class="text-container">
					<ul class="car-details">
						<p
							v-for="(paragraph, index) in currentCar.paragraphs"
							:key="index"
							class="car-info"
						>
							<span
								:ref="(el) => setParagraphRefs(el, index)"
							></span>
						</p>
					</ul>
				</section>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			currentIndex: -1,
			text: "GODS OF ROADS ",
			paragraphRefs: [],
			typingSpeed: 20,
			isTyping: false,
			typingController: null,
			cars: [
				{
					titleText: "Penetrator - 80's",
					imageUrl: require("@/assets/car1.gif"),
					paragraphs: [
						"Год выпуска: 1968 - 1975",
						"Максимальная скорость: 170 км/ч ",
						"Лошадиные силы: 653",
						"Расход топлива: 10 л/100 км ",
					],
				},
				{
					titleText: "Phantom GT",
					imageUrl: require("@/assets/car2.gif"),
					paragraphs: [
						"Год выпуска: 1985 - 1990",
						"Максимальная скорость: 210 км/ч ",
						"Лошадиные силы: 700",
						"Расход топлива: 12 л/100 км ",
					],
				},
			],
		};
	},

	computed: {
		currentCar() {
			return this.cars[this.currentIndex] || {};
		},
	},

	methods: {
		handleKeyPress(event) {
			if (event.key === "1") {
				this.switchContent(-1);
			} else if (event.key === "2") {
				this.switchContent(1);
			}
		},
		switchContent(direction) {
			this.isTyping = false;

			// Отменяем текущий процесс печатания
			if (this.typingController) {
				this.typingController.abort();
			}

			// Полностью очищаем старое содержимое
			this.resetState();

			// Изменяем текущий индекс
			this.currentIndex += direction;

			if (this.currentIndex < -1) {
				this.currentIndex = this.cars.length - 1;
			} else if (this.currentIndex > this.cars.length - 1) {
				this.currentIndex = -1;
			}

			// Запускаем процесс печатания для нового контента
			if (this.currentIndex !== -1) {
				this.startTyping();
			}
		},
		resetState() {
			if (this.$refs.typingText) {
				this.$refs.typingText.innerHTML = "";
			}

			for (const ref of this.paragraphRefs) {
				if (ref) {
					ref.innerHTML = "";
				}
			}

			const carDetailsElement = document.querySelector(".car-info");
			if (carDetailsElement) {
				carDetailsElement.innerHTML = ""; // Полностью очищаем содержимое
			}

			// Сбрасываем ссылки на параграфы
			this.paragraphRefs = [];
		},
		async startTyping() {
			this.isTyping = true;

			// Создаем новый AbortController
			this.typingController = new AbortController();
			const signal = this.typingController.signal;

			const text = this.currentCar?.titleText?.split("") || [];
			console.log("text:", text);
			const target = this.$refs.typingText;
			if (target == undefined) target.innerHTML = "";
			// Очищаем содержимое перед началом печатания
			if (target) target.innerHTML = "";

			try {
				// Печатаем заголовок
				let content = "";
				for (const char of text) {
					if (signal.aborted) throw new Error("Typing aborted");
					content += char;
					if (target) {
						target.innerHTML =
							content + '<span class="cursor"></span>';
					}
					await this.sleep(this.typingSpeed);
				}
				if (target) target.innerHTML = content;

				if (!Array.isArray(this.currentCar?.paragraphs)) return;

				// Печатаем параграфы
				for (let i = 0; i < this.currentCar.paragraphs.length; i++) {
					if (signal.aborted) throw new Error("Typing aborted");

					const paragraphText =
						this.currentCar.paragraphs[i].split("");
					const paragraphTarget = this.paragraphRefs[i];

					// Очищаем содержимое текущего параграфа
					if (paragraphTarget) paragraphTarget.innerHTML = "";

					let paragraphContent = "";
					for (const char of paragraphText) {
						if (signal.aborted) throw new Error("Typing aborted");
						paragraphContent += char;
						if (paragraphTarget) {
							paragraphTarget.innerHTML =
								paragraphContent +
								'<span class="cursor"></span>';
						}
						await this.sleep(this.typingSpeed);
					}

					if (paragraphTarget) {
						paragraphTarget.innerHTML = paragraphContent;
					}
					await this.sleep(300);
				}
			} catch (error) {
				if (error.message !== "Typing aborted") {
					console.error(error);
				}
			}
		},
		setParagraphRefs(el, index) {
			if (el) {
				this.paragraphRefs[index] = el;
			}
		},
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
	},
};
</script>

<style scoped>
@import "@/css/CarPageStyle.css";

.page {
	background-color: #1f1e1e;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	outline: none;
}

.car-title {
	font-size: 3rem;
	color: rgb(0, 180, 0);
	margin-bottom: 20px;
}

.content {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80%;
}

.image-container img {
	max-width: 100%;
	max-height: 300px;
	border-radius: 10px;
}

.car-details p span {
	font-size: 1.7vw;
	color: rgb(0, 180, 0);
}

.cursor {
	display: inline-block;
	width: 10px;
	height: 1.2rem;
	background: rgb(0, 180, 0);
	animation: blink 0.8s steps(1) infinite;
}

@keyframes blink {
	50% {
		opacity: 0;
	}
}
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
