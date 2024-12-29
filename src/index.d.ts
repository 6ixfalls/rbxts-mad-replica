import { ArrayPath, OmitFirstParam, Path, PathValue, PathValues, StringPath, StringPathValue } from "./util";

import { ReplicaClient } from "./ReplicaClient";
import { ReplicaServer } from "./ReplicaServer";

export type Replica<C extends keyof Replicas = keyof Replicas> = ReplicaInstance<
	Replicas[C]["Data"],
	Replicas[C]["Tags"],
	Replicas[C]["WriteLib"]
>;

export interface ReplicaInstance<
	D extends Record<string, unknown> = {},
	T extends Record<string, unknown> = {},
	WL extends Record<string, unknown> = {},
> {
	/**
	 * Table representing the state wrapped by the `Replica`. Note that after wrapping a table with a `Replica` you may no longer write directly to that table (doing so would potentially desynchronize state among clients and in some cases even break code) \- all changes must be applied through [mutators](https://madstudioroblox.github.io/ReplicaService/api/#built-in-mutators).
	 * ```ts
	 * const PlayerData = {
	 *   Coins: 100
	 * }
	 * const PlayerStatsReplica = ReplicaService.NewReplica({
	 *   ClassToken: ReplicaService.NewClassToken("PlayerStats"),
	 *   Data: PlayerData, // Replica does not create a deep copy!
	 *   Tags: {
	 *     Player: Player
	 *   },
	 *   Replication: "All"
	 * });
	 *
	 * print(PlayerStatsReplica.Data === PlayerData); // true
	 * print(PlayerStatsReplica.Data.Coins); // 100
	 * PlayerStatsReplica.SetValue(["Coins"], 420);
	 * print(PlayerData.Coins, PlayerStatsReplica.Data.Coins); // 420 420
	 * ```
	 */
	readonly Data: D;
	/**
	 * An identifier that is unique for every `Replica` within a Roblox game session.
	 */
	readonly Id: number;
	/**
	 * The `tokenString` parameter that has been used for the [Token](https://madstudioroblox.github.io/ReplicaService/api/#replicaservicenewclasstoken) used to create this `Replica`.
	 */
	readonly Token: keyof Replicas;
	/**
	 * A custom static `Replica` identifier mainly used for referencing affected game instances. Only used for properties that will not change for the rest of the `Replica`'s lifespan.
	 * ```ts
	 * const CharacterReplica = ReplicaService.NewReplica({
	 *   ClassToken: ReplicaService.NewClassToken("Character"),
	 *   Tags: {
	 *     Player: Player,
	 *     Character: Character,
	 *     Appearance: "Ninja"
	 *   },
	 *   Replication: "All"
	 * });
	 * ```
	 */
	readonly Tags: T;
	/**
	 * Reference to the parent `Replica`. All **nested replicas** *will* have a parent. All **top level replicas** will have their `Parent` property set to `nil`. **Nested replicas** will never become **top level replicas** and vice versa.
	 */
	readonly Parent: Replica | undefined;
	/**
	 * An array of replicas parented to this `Replica`.
	 */
	readonly Children: Map<Replica, boolean>;
	/**
	 * The instance this `Replica` is bound to. WARNING: Will be set to nil after destruction.
	 */
	readonly BoundInstance: Instance | undefined;
	/**
	 * Returns `false` if the `Replica` was destroyed.
	 */
	IsActive(): boolean;
	/**
	 * Creates a brief string description of a `Replica`, excluding `Replica.Data` contents. Used for debug purposes.
	 * ```ts
	 * print(Replica.Identify()) // "[Id:7;Class:Flower;Tags:{Model=FlowerModel}]"
	 * ```
	 */
	Identify(): string;

	/**
	 * Sets any individual `value` within `Replica.Data` to `value`. Parameter `value` can be `nil` and will set the value located in `path` to `nil`.
	 */
	Set<P extends Path<D, "Main">>(path: P, value: PathValue<D, P>): void;
	/**
	 * Sets multiple keys located in `path` to specified `values`.
	 * ```ts
	 * Replica.SetValues(["Fruit"], {
	 *   Apples: 5,
	 *   Oranges: 2,
	 *   // WARNING: undefined (which it's nil) values will not work with replica:SetValues()
	 *   Bananas: undefined, // THIS IS INVALID, USE
	 *   // Replica.SetValue(["Fruit", "Bananas"], undefined)
	 * });
	 * print(Replica.Data.Fruit.Oranges); // 2
	 * ```
	 */
	SetValues<P extends Path<D, "Objects">>(path: P, values: PathValues<D, P>): void;
	/**
	 * Performs `table.insert(t, value)` where `t` is a numeric sequential array `table` located in `path`.
	 */
	TableInsert<P extends Path<D, "Arrays">>(
		path: P,
		value: PathValue<D, P> extends Array<infer T> ? T : never,
		index?: number,
	): number;
	/**
	 * Performs `table.remove(t, index)` where `t` is a numeric sequential array `table` located in `path`.
	 */
	TableRemove<P extends Path<D, "Arrays">>(
		path: P,
		index: number,
	): PathValue<D, P> extends Array<infer T> ? T : never;

	/**
	 * Calls a function within a [WriteLib](https://madstudioroblox.github.io/ReplicaService/api/#writelib) that has been assigned to this `Replica` for both the server and all clients that have this `Replica` replicated to them.
	 */
	Write<P extends StringPath<WL, "Callbacks">>(
		functionName: P,
		...params: Parameters<OmitFirstParam<StringPathValue<WL, P>>>
	): ReturnType<StringPathValue<WL, P>>;
	/**
	 * Simulates the behaviour of [RemoteEvent.OnServerEvent](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#OnServerEvent).
	 */
	readonly OnServerEvent: RBXScriptSignal<(player: Player, ...params: unknown[]) => void>;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireClient()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireClient).
	 */
	FireClient(player: Player, ...params: unknown[]): void;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireAllClients()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireAllClients).
	 */
	FireAllClients(...params: unknown[]): void;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireClient()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireClient) through an Unreliable event.
	 */
	UFireClient(player: Player, ...params: unknown[]): void;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireAllClients()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireAllClients) through an Unreliable event.
	 */
	UFireAllClients(...params: unknown[]): void;
	/**
	 * Changes the `Parent` of the `Replica`.
	 *
	 * **Only nested replicas can have their parents changed (nested replicas are replicas that were initially created with a parent).**
	 *
	 * If a `Replica`, from a single player's perspective, is moved from a non-replicated parent to a replicated parent, the replica will be created for the player as expected. Likewise, parenting a replica to a non\-replicated replica will destroy it for that player. This feature is useful for controlling visible game chunks with entities that can move between those chunks.
	 */
	SetParent(replica: Replica): void;
	/**
	 * Bind the `Replica` to a specific Instance.
	 */
	BindToInstance(instance: Instance): void;
	/**
	 * Subscribes all existing and future players; ":Subscribe()" and ":Unsubscribe()" will become locked
	 */
	Replicate(): void;
	/**
	 * Resets all previous subscription settings;
	 */
	DontReplicate(): void;
	/**
	 * Replicates to player; WILL NOT subscribe to players that are not ready & will throw a warning for trying to do so.
	 */
	Subscribe(player: Player): void;
	/**
	 * Destroys Replica for player
	 */
	Unsubscribe(player: Player): void;
	/**
	 * Destroys replica and all of its descendants (Depth\-first). `Replica` destruction signal is sent to the client first, while cleanup tasks assigned with `Replica:AddCleanupTask()` will be performed after.
	 */
	Destroy(): void;

	/**
	 * Listens to WriteLib mutator functions being triggered. See [WriteLib](https://madstudioroblox.github.io/ReplicaService/api/#writelib) section for examples.
	 */
	OnWrite<P extends StringPath<WL, "Callbacks">>(
		functionName: P,
		listener: (...params: Parameters<OmitFirstParam<StringPathValue<WL, P>>>) => void,
	): RBXScriptConnection;
	/**
	 * Creates a listener which gets triggered by `Replica:Set()` calls. For `Replica:SetValues()`, you can use `Replica:OnChange()`.
	 */
	OnSet<P extends Path<D, "Main">>(
		path: P,
		listener: (newValue: PathValue<D, P>, oldValue: PathValue<D, P>) => void,
	): RBXScriptConnection;
	/**
	 * Allows the developer to parse exact arguments that have been passed to any of the [built-in mutators](https://madstudioroblox.github.io/ReplicaService/api/#built-in-mutators).
	 *
	 * Possible parameter reference for `Replica:OnChange()`:
	 * ```ts
	 * // ("Set", path, value)
	 * // ("SetValues", path, values)
	 * // ("TableInsert", path, value)
	 * // ("TableRemove", path, index, oldValue)
	 *
	 * // path: Array<string>
	 * ```
	 */
	OnChange<A extends "Set" | "SetValues" | "TableInsert" | "TableRemove">(
		listener: A extends "Set"
			? (
					action: "Set",
					path: ArrayPath<D, "Main">,
					value: PathValue<D, ArrayPath<D, "Main">>,
					oldValue: PathValue<D, ArrayPath<D, "Main">>,
			  ) => void
			: A extends "SetValues"
			? (
					action: "SetValues",
					path: ArrayPath<D, "Objects">,
					values: PathValues<D, ArrayPath<D, "Objects">>,
			  ) => void
			: A extends "TableInsert"
			? (
					action: "TableInsert",
					path: ArrayPath<D, "Arrays">,
					value: PathValue<D, ArrayPath<D, "Arrays">> extends Array<infer T> ? T : never,
					index: number,
			  ) => void
			: A extends "TableRemove"
			? (
					action: "TableRemove",
					path: ArrayPath<D, "Arrays">,
					value: PathValue<D, ArrayPath<D, "Arrays">> extends Array<infer T> ? T : never,
					index: number,
			  ) => void
			: never,
	): RBXScriptConnection;
	/**
	 * Simulates the behaviour of [RemoteEvent.OnClientEvent](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#OnClientEvent).
	 */
	readonly OnClientEvent: RBXScriptSignal<(player: Player, ...params: unknown[]) => void>;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireServer()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireServer).
	 */
	FireServer(...params: unknown[]): void;
	/**
	 * Simulates the behaviour of [RemoteEvent:FireServer()](https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireServer). This is an unreliable event.
	 */
	UFireServer(...params: unknown[]): void;
	/**
	 * GetChild
	 */
	GetChild<C extends keyof Replicas>(token: C): Replica<C> | undefined;
}

export declare const ReplicaClient: ReplicaClient;
export declare const ReplicaServer: ReplicaServer;
