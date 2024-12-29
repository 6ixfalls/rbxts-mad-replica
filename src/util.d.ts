declare global {
	interface Replicas {}
}

export type PrimitiveTypes = string | number | boolean | symbol | undefined;
export type SpecialTypes = Array<unknown> | Callback | Symbol | Map<unknown, unknown> | Set<unknown>;
export type RobloxDataTypes =
	| Axes
	| BrickColor
	| CFrame
	| CatalogSearchParams
	| Color3
	| ColorSequence
	| ColorSequenceKeypoint
	| DateTime
	| DockWidgetPluginGuiInfo
	| Enum
	| EnumItem
	| Enums
	| Faces
	| FloatCurveKey
	| Font
	| Instance
	| NumberRange
	| NumberSequence
	| NumberSequenceKeypoint
	| OverlapParams
	| PathWaypoint
	| PhysicalProperties
	| RBXScriptConnection
	| RBXScriptSignal
	| Random
	| Ray
	| RaycastParams
	| RaycastResult
	| Rect
	| Region3
	| Region3int16
	| TweenInfo
	| UDim
	| UDim2
	| Vector2
	| Vector2int16
	| Vector3
	| Vector3int16;
export type MainTypes = PrimitiveTypes | SpecialTypes | RobloxDataTypes;

export type Cleanable = { Destroy(): void } | { Disconnect(): void };
export type Task = Callback | Instance | Cleanable;
export type ReplicationTypes = "All" | Map<Player, true> | Player;
export type ReplicaToken<C extends keyof Replicas> = {
	Name: C;
};

export type IsRealObject<T> = T extends MainTypes ? false : T extends object ? true : false;
export type ValueFilterTypes = "Main" | "Objects" | "Arrays" | "Callbacks";
export type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];
export type DefaultDepth = 20;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitFirstParam<C> = C extends (toOmit: any, ...rest: infer Rest) => infer R
	? (...params: Rest) => R
	: never;

export type ArrayPath<T, VF extends ValueFilterTypes, P extends Array<string> = [], D extends number = DefaultDepth> = [
	D,
] extends [never]
	? never
	: IsRealObject<T> extends true
	? {
			[K in keyof T]-?: K extends string
				? VF extends "Main"
					? IsRealObject<T[K]> extends true
						? ArrayPath<T[K], "Main", [...P, K], Prev[D]>
						: [...P, K]
					: VF extends "Objects"
					? IsRealObject<T[K]> extends true
						? [...P, K] | ArrayPath<T[K], "Objects", [...P, K], Prev[D]>
						: never
					: VF extends "Arrays"
					? T[K] extends Array<unknown>
						? [...P, K]
						: IsRealObject<T[K]> extends true
						? ArrayPath<T[K], "Arrays", [...P, K], Prev[D]>
						: never
					: VF extends "Callbacks"
					? T[K] extends Callback
						? [...P, K]
						: IsRealObject<T[K]> extends true
						? ArrayPath<T[K], "Callbacks", [...P, K], Prev[D]>
						: never
					: never
				: never;
	  }[keyof T]
	: [];
export type ArrayPathValue<T, P extends Array<string>> = P extends [infer K]
	? K extends keyof T
		? T[K]
		: never
	: P extends [infer K, ...infer Rest extends Array<string>]
	? K extends keyof T
		? ArrayPathValue<T[K], Rest>
		: never
	: never;

export type StringPath<T, VF extends ValueFilterTypes, P extends string = "", D extends number = DefaultDepth> = [
	D,
] extends [never]
	? never
	: IsRealObject<T> extends true
	? {
			[K in keyof T]-?: K extends string
				? VF extends "Main"
					? IsRealObject<T[K]> extends true
						? StringPath<T[K], "Main", `${P}${K}.`, Prev[D]>
						: `${P}${K}`
					: VF extends "Objects"
					? IsRealObject<T[K]> extends true
						? `${P}${K}` | StringPath<T[K], "Objects", `${P}${K}.`, Prev[D]>
						: never
					: VF extends "Arrays"
					? T[K] extends Array<unknown>
						? `${P}${K}`
						: IsRealObject<T[K]> extends true
						? StringPath<T[K], "Arrays", `${P}${K}.`, Prev[D]>
						: never
					: VF extends "Callbacks"
					? T[K] extends Callback
						? `${P}${K}`
						: IsRealObject<T[K]> extends true
						? StringPath<T[K], "Callbacks", `${P}${K}.`, Prev[D]>
						: never
					: never
				: never;
	  }[keyof T]
	: "";
export type StringPathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? StringPathValue<T[K], Rest>
		: never
	: P extends keyof T
	? T[P]
	: never;

export type Path<T extends object, VF extends ValueFilterTypes> = ArrayPath<T, VF> | StringPath<T, VF>;
export type PathValue<T extends object, P extends string | Array<string>> = P extends string
	? StringPathValue<T, P>
	: P extends Array<string>
	? ArrayPathValue<T, P>
	: never;
export type PathValues<
	T extends object,
	P extends string | Array<string>,
	V = PathValue<T, P>,
> = IsRealObject<V> extends true
	? Partial<{
			[K in keyof V]: V[K];
	  }>
	: never;
