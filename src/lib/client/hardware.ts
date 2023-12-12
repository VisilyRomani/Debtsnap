export const set_create_hardware = () => {
	let hardware_id = localStorage.getItem('hardware_id');
	if (hardware_id) {
		return hardware_id;
	} else {
		const id = uuidv4();
		localStorage.setItem('hardware_id', id);
		console.log(id);
		return id;
	}
};
function uuidv4() {
	return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
		(
			parseInt(c) ^
			(crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (parseInt(c) / 4)))
		).toString(16)
	);
}
