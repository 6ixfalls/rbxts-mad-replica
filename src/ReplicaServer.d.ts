import { ReplicaToken } from "./util";
import { Replica } from "./index";

export interface ReplicaServer {
	/**
	 * A reference of players that have received initial data - having received initial data means having access to all replicas that are selectively replicated to that player.
	 */
	readonly ReadyPlayers: ReadonlyMap<Player, true>;
	/**
	 * A signal for new `ReplicaService.ActivePlayers` entries.
	 */
	NewReadyPlayer: RBXScriptSignal<(player: Player) => void>;
	/**
	 * A signal for removed `ReplicaService.RemovedActivePlayerSignal` entries.
	 */
	RemovingReadyPlayer: RBXScriptSignal<(player: Player) => void>;
	/**
	 * Tokens for a particular `token_string` can only be created once - this helps the developer avoid `Replica` class name collisions when merging codebases.
	 */
	Token: <C extends keyof Replicas>(tokenString: C) => ReplicaToken<C>;
	/**
	 * Creates a replica and immediately replicates to select [active players](https://madstudioroblox.github.io/ReplicaService/api/#replicaserviceactiveplayers) based on replication settings of this `Replica` or the parent `Replica`.
	 */
	New: <C extends keyof Replicas>(replicaParams: {
		/**
		 * Sets `Replica.Token` to the string provided in `ReplicaService.NewToken(tokenString)`.
		 */
		Token: ReplicaToken<C>;
		/**
		 * (Default: `{}` empty table) A table representing a state. Using `Profile.Data` from [ProfileService](https://madstudioroblox.github.io/ProfileService/) is valid!
		 */
		Data?: Replicas[C]["Data"];
		/**
		 * (Default: `{}` empty table) A dictionary of identifiers. Use `Tags` to let the client know which game objects the `Replica` belongs to: `Tags: {Part: part, Player: player, ...}`. Tags can't be changed after the `Replica` is created.
		 */
		Tags?: Replicas[C]["Tags"];
		/**
		 * (Default: `nil`) Provide a `ModuleScript` (not the return of `require()`) to assign write functions (mutator functions) to this replica. The `WriteLib` parameter is individual for every `Replica`.
		 */
		WriteLib?: ModuleScript;
	}) => Replica<C>;
	/**
	 * Returns a `Replica` that is loaded server-side with a `Replica.Id` that matches `replicaId`.
	 */
	FromId: (replicaId: number) => Replica;
}

export declare const ReplicaServer: ReplicaServer;
