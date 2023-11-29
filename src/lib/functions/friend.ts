import { pb } from '$lib/pocketbase';

export const getFriends = async (userId: string) => {
	return (
		(
			await pb
				.collection('users')
				.getOne<{ expand: { friends: { id: string; name: string; username: string }[] } }>(userId, {
					expand: 'friends',
					fields: 'expand.friends.id,expand.friends.name,expand.friends.username',
					requestKey: null
				})
		).expand?.friends ?? []
	);
};

export const getFriendRequests = async () => {
	return (
		(
			await pb.collection('friend_request').getFullList<{
				expand: { sender: { id: string; name: string; username: string } };
				id: string;
			}>({
				expand: 'sender',
				fields: 'expand.sender.id,expand.sender.name,expand.sender.username,id',
				requestKey: null
			})
		).map((d) => ({
			id: d.id,
			sender_id: d.expand.sender.id,
			name: d.expand.sender.name,
			username: d.expand.sender.username
		})) ?? []
	);
};
