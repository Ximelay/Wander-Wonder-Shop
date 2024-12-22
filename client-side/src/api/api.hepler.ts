/**
 * Функция для получения заголовка Content-Type.
 * Используется для указания типа содержимого в HTTP-запросах.
 * @returns {Object} Объект с заголовком Content-Type.
 */
export const getContentType = () => ({
	'Content-type': 'application/json'
})
/**
 * Функция для обработки ошибок, полученных от API.
 * @param {any} error - Объект ошибки.
 * @returns {string} Сообщение об ошибке.
 */
export const errorCatch = (error: any): string => {
	const message = error?.response?.data?.message

	return message
		? typeof error.response.data.message === 'object'
			? message[0]
			: message
		: error.message
}
