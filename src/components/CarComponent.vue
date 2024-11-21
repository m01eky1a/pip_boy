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
			<div>
				<h1 class="car-title" ref="typingText"></h1>
			</div>
			<div class="content">
				<figure class="image-container">
					<img :src="currentCar.imageUrl" class="qr-image" />
				</figure>
				<div v-show="currentIndex == 5" class="qr-title">
					СДЕЛАТЬ <br />
					ЗАЕЗД
				</div>
				<section class="text-container">
					<div
						class="car-details"
						:style="{ fontSize: dynamicFontSize }"
					>
						<div
							v-for="(paragraph, index) in currentCar.paragraphs"
							:key="index"
							class="car-info"
						>
							<span
								:ref="(el) => setParagraphRefs(el, index)"
							></span>
						</div>
					</div>
				</section>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			paddingValues: [0, 0, 0, 0],
			selectedPaddingIndex: 0,
			currentIndex: -1,
			text: "GODS OF ROADS ",
			paragraphRefs: [],
			typingSpeed: 20,
			isTyping: false,
			typingController: null,
			isFullscreen: false,
			textContainerWidth: 0,
			baseFontSize: 18,
			cars: [
				{
					titleText: "TARANTULA",
					imageUrl: require("@/assets/car_model/tarantula.gif"),
					paragraphs: [
						"МОЩНОСТЬ: 700 Л.С",
						"КРУТЯЩИЙ МОМЕНТ: 700 Н·М",
						"МАКСИМАЛЬНАЯ СКОРОСТЬ: 450 КМ/Ч ",
						"ВЕС: 1273 КГ",
					],
				},
				{
					titleText: "BOWIE",
					imageUrl: require("@/assets/car_model/bowie.gif"),
					paragraphs: [
						"МОЩНОСТЬ: 800 Л.С",
						"КРУТЯЩИЙ МОМЕНТ: 650 Н·М",
						"МАКСИМАЛЬНАЯ СКОРОСТЬ: 420 КМ/Ч ",
						"ВЕС: 1489 КГ",
					],
				},
				{
					titleText: "HORNET",
					imageUrl: require("@/assets/car_model/hornet.gif"),
					paragraphs: [
						"МОЩНОСТЬ: 300 Л.С",
						"КРУТЯЩИЙ МОМЕНТ: 407 Н·М",
						"МАКСИМАЛЬНАЯ СКОРОСТЬ: 375 КМ/Ч ",
						"ВЕС: 1020 КГ",
					],
				},
				{
					titleText: "ANT",
					imageUrl: require("@/assets/car_model/ant.gif"),
					paragraphs: [
						"МОЩНОСТЬ: 195 Л.С",
						"КРУТЯЩИЙ МОМЕНТ: 178 Н·М",
						"МАКСИМАЛЬНАЯ СКОРОСТЬ: 245 КМ/Ч ",
						"ВЕС: 580 КГ",
					],
				},
				{
					titleText: "CRICKET",
					imageUrl: require("@/assets/car_model/cricket.gif"),
					paragraphs: [
						"МОЩНОСТЬ: 49 Л.С",
						"КРУТЯЩИЙ МОМЕНТ: 32 Н·М",
						"МАКСИМАЛЬНАЯ СКОРОСТЬ: 195 КМ/Ч ",
						"ВЕС: 90 КГ",
					],
				},
				{
					titleText: "",
					imageUrl: require("@/assets/QR.png"),
				},
			],
		};
	},
	mounted() {
		this.$el.focus();
		this.updateTextContainerWidth();
		window.addEventListener("resize", this.updateTextContainerWidth);
	},
	beforeDestroy() {
		window.removeEventListener("resize", this.updateTextContainerWidth);
	},
	computed: {
		currentCar() {
			return this.cars[this.currentIndex] || {};
		},
		dynamicFontSize() {
			return `${Math.max(
				this.baseFontSize * (this.textContainerWidth / 500),
				11
			)}px`;
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
		updateTextContainerWidth() {
			const textContainer = this.$el.querySelector(".text-container");
			if (textContainer) {
				this.textContainerWidth = textContainer.offsetWidth;
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
				this.$nextTick(this.updateTextContainerWidth);
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
							paragraphContent + '<span class="cursor">_</span>';
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
@import "@/css/LedStyle.css";
</style>
