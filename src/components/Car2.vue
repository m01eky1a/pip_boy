<template>
	<div class="page">
		<h1 class="car-title" ref="typingText"></h1>
		<div class="content">
			<figure class="image-container">
				<img src="@/assets/car2.gif" alt="Car Image" />
			</figure>
			<section class="text-container">
				<ul class="car-details">
					<p v-for="(paragraph, index) in paragraphs" :key="index">
						<span :ref="(el) => setParagraphRefs(el, index)"></span>
					</p>
				</ul>
			</section>
		</div>
	</div>
</template>

<script>
export default {
	name: "Car1",
	data() {
		return {
			titleText: "Phantom GT",
			typingSpeed: 20,
			paragraphs: [
				"Год выпуска: 1985 - 1990",
				"Максимальная скорость: 210 км/ч | 130 mph",
				"Лошадиные силы: 700",
				"Расход топлива: 12 л/100 км | 20 US mpg | 8км/л",
				"Страна производства: Германия",
				"Тип трансмиссии: Автоматическая",
				"Дорожный просвет: 150 мм",
				"Масса: 1.5 тонны",
			],
			paragraphRefs: [],
		};
	},
	mounted() {
		this.startTyping();
	},
	methods: {
		// Эффект печатания текста
		async startTyping() {
			// Печатаем заголовок
			const text = this.titleText.split(""); // Разбиваем текст на символы
			const target = this.$refs.typingText; // Ссылка на элемент для печатания
			let content = ""; // Инициализируем переменную для хранения текста
			target.innerHTML = ""; // Очищаем содержимое перед печатанием

			for (const char of text) {
				content += char; // Добавляем символ к контенту
				target.innerHTML = content + '<span class="cursor"></span>'; // Обновляем innerHTML с курсором
				await this.sleep(this.typingSpeed); // Ждем перед добавлением следующего
			}

			// Удаляем курсор после печати заголовка
			target.innerHTML = content;

			// Печатаем параграфы один за другим
			for (let i = 0; i < this.paragraphs.length; i++) {
				const paragraphText = this.paragraphs[i].split("");
				const paragraphTarget = this.paragraphRefs[i];
				let paragraphContent = "";
				paragraphTarget.innerHTML = "";

				for (const char of paragraphText) {
					paragraphContent += char;
					paragraphTarget.innerHTML =
						paragraphContent + '<span class="cursor"></span>';
					await this.sleep(this.typingSpeed);
				}

				// Удаляем курсор после печати параграфа
				paragraphTarget.innerHTML = paragraphContent;

				// Добавляем небольшую паузу перед следующим параграфом
				await this.sleep(300);
			}
		},
		// Собираем ссылки на параграфы
		setParagraphRefs(el, index) {
			if (el) {
				this.paragraphRefs[index] = el;
			}
		},
		// Вспомогательная функция для паузы
		sleep(ms) {
			return new Promise((resolve) => setTimeout(resolve, ms));
		},
	},
};
</script>

<style scoped>
@import "@/css/CarPageStyle.css";
</style>
