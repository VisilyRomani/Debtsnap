export const delay = (ms: number) => {
	return new Promise((resolve) => {
		setTimeout(() => resolve(''), ms);
	});
};

export const statusColor = (status: string) => {
	switch (status) {
		case 'completed':
			return 'border-left: 4px green solid;';
		case 'requested':
			return 'border-left: 4px red solid';
		case 'pending':
			return 'border-left: 4px orange solid;';
		default:
			return 'border-left: 4px gray solid;';
	}
};
