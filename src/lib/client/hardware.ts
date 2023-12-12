export const set_create_hardware = () => {
	let hardware_id = localStorage.getItem('hardware_id');
	if (hardware_id) {
		return hardware_id;
	} else {
		const id = crypto.randomUUID();
		localStorage.setItem('hardware_id', id);
		console.log(id);
		return id;
	}
};
