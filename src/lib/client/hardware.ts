import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 10 });

export const set_create_hardware = () => {
	let hardware_id = localStorage.getItem('hardware_id');
	if (hardware_id) {
		return hardware_id;
	} else {
		const id = uid.rnd();
		localStorage.setItem('hardware_id', id);
		console.log(id);
		return id;
	}
};
