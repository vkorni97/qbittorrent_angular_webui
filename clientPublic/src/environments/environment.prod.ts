export const environment = {
	production: true,
	url: ''
};

if (window) {
	window.console.log = window.console.error = () => {};
}
