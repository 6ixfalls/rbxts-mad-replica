import { ReplicaServer } from "@rbxts/mad-replica";
import { Players } from "@rbxts/services";

declare global {
	interface Replicas {
		PlayerData: {
			Data: {
				Score: number;
				Nested: {
					Value: boolean;
				};
			};
			Tags: {};
		};
	}
}

Players.PlayerAdded.Connect((player: Player) => {
	const replica = ReplicaServer.New({
		Token: ReplicaServer.Token("PlayerData"),
		Data: {
			Score: 50,
			Nested: {
				Value: false,
			},
		},
	});

	replica.Replicate();

	task.spawn(() => {
		let tempVar = 100;
		while (true) {
			replica.Set(["Score"], replica.Data.Score + 100);
			tempVar += 100;
			task.wait(1);
		}
	});

	replica.Set(["Nested", "Value"], false);
});
