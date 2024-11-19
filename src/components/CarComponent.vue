<template>
	<div @keydown="handleKeyPress" tabindex="0">
		<!-- Текст "GODS OF ROADS" -->
		<div v-show="currentIndex === -1" class="led-container">
			<div class="led-display">
				<div class="scrolling-text">{{ text }}</div>
			</div>
		</div>

		<!-- Контент машин -->
		<div
			v-show="currentIndex !== -1"
			class="page"
			:style="{ padding: getPaddingStyle() }"
		>
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
			paddingValues: [0, 0, 0, 0], // top, right, bottom, left
			selectedPaddingIndex: 0,
			currentIndex: -1,
			text: "GODS OF ROADS ",
			paragraphRefs: [],
			typingSpeed: 20,
			isTyping: false,
			typingController: null,
			isFullscreen: false,
			cars: [
				{
					titleText: "Penetrator - 80's",
					imageUrl: require("@/assets/car_model/device_ant.gif"),
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
		/** Слушатель нажатия на цифры  */
		handleKeyPress(event) {
			if (event.key === "1") {
				this.switchContent(-1);
			} else if (event.key === "2") {
				this.switchContent(1);
			} else if (event.key === "3") {
				this.toggleFullscreen();
			} else if (event.key === "4") {
				this.updatePadding(-5);
			} else if (event.key === "5") {
				this.updatePadding(5);
			} else if (event.key === "6") {
				this.selectedPaddingIndex = (this.selectedPaddingIndex + 1) % 4;
			}
		},
		toggleFullscreen() {
			const doc = document.documentElement;

			if (!this.isFullscreen) {
				// Включаем полноэкранный режим
				if (doc.requestFullscreen) {
					doc.requestFullscreen();
				} else if (doc.mozRequestFullScreen) {
					doc.mozRequestFullScreen();
				} else if (doc.webkitRequestFullscreen) {
					doc.webkitRequestFullscreen();
				} else if (doc.msRequestFullscreen) {
					doc.msRequestFullscreen();
				}
			} else {
				// Выходим из полноэкранного режима
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}

			this.isFullscreen = !this.isFullscreen;
		},
		/** Обновление отступа  */
		updatePadding(amount) {
			const newValue =
				this.paddingValues[this.selectedPaddingIndex] + amount;
			if (newValue >= 0) {
				this.paddingValues[this.selectedPaddingIndex] = newValue;
			}
		},

		/** Возвращаем в стиль настроенный отступ  */
		getPaddingStyle() {
			return this.paddingValues.map((v) => `${v}px`).join(" ");
		},

		/** Смена печати контента  */
		switchContent(direction) {
			this.isTyping = false;

			// Отменяем текущий процесс печатания
			if (this.typingController) {
				this.typingController.abort();
			}
			this.resetState();

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

		/** Ресет данных о машине  */
		resetState() {
			if (this.$refs.typingText) {
				this.$refs.typingText.innerHTML = "";
			}
			for (const ref of this.paragraphRefs) {
				if (ref) {
					ref.innerHTML = "";
				}
			}
			this.paragraphRefs = [];
		},

		/** Анимация печати  */
		async startTyping() {
			this.isTyping = true;

			// Создаем новый AbortController
			this.typingController = new AbortController();
			const signal = this.typingController.signal;

			const text = this.currentCar?.titleText?.split("") || [];
			const target = this.$refs.typingText;

			if (!target) {
				console.warn("Ref 'typingText' is undefined. Skipping typing.");
				return;
			}

			// Очищаем содержимое перед началом печатания
			target.innerHTML = "";

			try {
				let content = "";
				for (const char of text) {
					if (signal.aborted) throw new Error("Typing aborted");
					content += char;
					target.innerHTML = content + '<span class="cursor"></span>';
					await this.sleep(this.typingSpeed);
				}
				target.innerHTML = content;

				if (!Array.isArray(this.currentCar?.paragraphs)) return;

				for (let i = 0; i < this.currentCar.paragraphs.length; i++) {
					if (signal.aborted) throw new Error("Typing aborted");

					const paragraphText =
						this.currentCar.paragraphs[i].split("");
					const paragraphTarget = this.paragraphRefs[i];

					if (!paragraphTarget) continue;

					paragraphTarget.innerHTML = "";
					let paragraphContent = "";
					for (const char of paragraphText) {
						if (signal.aborted) throw new Error("Typing aborted");
						paragraphContent += char;
						paragraphTarget.innerHTML =
							paragraphContent + '<span class="cursor"></span>';
						await this.sleep(this.typingSpeed);
					}

					paragraphTarget.innerHTML = paragraphContent;
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

.cursor {
	display: inline-block;
	width: 10px;
	height: 1.2rem;
	background: #f70000;
	animation: blink 0.8s steps(1) infinite;
}

@keyframes blink {
	50% {
		opacity: 0;
	}
}
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
	opacity: 0.04;
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
	font-family: "Tiny5", sans-serif;
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
