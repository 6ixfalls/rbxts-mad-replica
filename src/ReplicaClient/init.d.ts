import { Replica } from "../index";

export interface ReplicaClient {
	/**
	 * OnLocalReady
	 */
	OnLocalReady: RBXScriptSignal<() => void>;
	/**
	 * IsReady
	 */
	IsReady: boolean;
	/**
	 * Listens to creation of replicas client\-side of a particular class.
	 * ```ts
	 * ReplicaController.ReplicaOfClassCreated("Flower", (replica) => {
	 *   print(`Flower replica created: ${replica.Identify()}`);
	 *   print(replica.Class === "Flower") // true
	 * });
	 * ```
	 * This is the preferred method of grabbing references to all replicas clients\-side.
	 */
	OnNew: <C extends keyof Replicas>(token: C, listener: (replica: Replica<C>) => void) => RBXScriptConnection;
	/**
	 * Returns a `Replica` that is loaded client\-side with a `Replica.Id` that matches `replicaId`.
	 */
	FromId: (replicaId: number) => Replica | undefined;
	/**
	 * Requests the server to start sending replica data.
	 *
	 * **All `.NewReplicaSignal` and `.ReplicaOfClassCreated()` listeners should be connected before calling `.RequestData()`! \- refrain from connecting listeners afterwards!**
	 *
	 * If your game has local scripts that may run later during gameplay and they will need to interact with replicas, you should create a centralized module that connects `Replica` creation listeners before `.RequestData()` and provides those local scripts with the replica references they need.
	 */
	RequestData: () => void;
}
