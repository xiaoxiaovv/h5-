export const textToast = (text) => {
	// uni.showToast({
	// 	title: text,
	// 	duration: 1000,
	// 	icon: 'none'
	// });
	alert(text);
}

export const loading = () => {
	uni.showLoading({
		title: '加载中',
		mask: true
	});
}