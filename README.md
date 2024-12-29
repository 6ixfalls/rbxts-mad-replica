# ReplicaService Typings

> `roblox-ts` typings for ReplicaService made by MadStudio.

Scrapped together hackily, but it works. Waiting for API docs to release to improve documentation. Some documentation has not been updated yet.

## Table of Contents

- [TypeScript Example](#typescript-example)
- [Recommendations](#recommendations)
- [Limitations](#limitations)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Documentation](#documentation)
- [Support](#support)

## TypeScript Example

`src/Types/Replicas.d.ts`

```ts
import { Replica } from "@rbxts/replicaservice";
import PlayerDataReplicaWriteLib from "../Shared/WriteLibs/PlayerData";

declare global {
  interface Replicas {
    PlayerData: {
      Data: {
        Money: number;
      };
      Tags: {};
      WriteLib: typeof PlayerDataReplicaWriteLib;
    };
  }
}

export type PlayerDataReplica = Replica<"PlayerData">;
```

`src/Shared/WriteLibs/PlayerData.ts`

```ts
import { PlayerDataReplica } from "../../Types/Replicas.d";

export = {
  ChangeMoney: (
    replica: PlayerDataReplica,
    method: "Add" | "Sub",
    value: number
  ) => {
    const FinalValue =
      method === "Add"
        ? replica.Data.Money + value
        : replica.Data.Money - value;
    if (FinalValue < 0) return replica.SetValue(["Money"], 0);
    replica.SetValue(["Money"], FinalValue);
  },
};
```

`src/Server/Main.server.ts`

```ts
import { ReplicaService } from "@rbxts/replicaservice";
import { Players, ReplicatedStorage } from "@rbxts/services";

const PlayerDataReplicaWriteLib: ModuleScript = ReplicatedStorage.WaitForChild(
  "WriteLibs"
).WaitForChild("PlayerData") as ModuleScript; // This varies depending on your "default.project.json" paths.

Players.PlayerAdded.Connect((player: Player) => {
  const PlayerDataReplica = ReplicaService.NewReplica({
    ClassToken: ReplicaService.NewClassToken("PlayerData"),
    Data: {
      Money: 500,
    },
    Replication: player,
    WriteLib: PlayerDataReplicaWriteLib,
  });

  while (task.wait(1)) {
    PlayerDataReplica.Write("ChangeMoney", "Add", 500);
    // This example uses WriteLib feature of ReplicaService, but if you don't want/don't need to use a WriteLib, then you can do: PlayerDataReplica.SetValue(["Money"], PlayerDataReplica.Data.Money + 500)
  }
});
```

`src/Client/Main.client.ts`

```ts
import { ReplicaController } from "@rbxts/replicaservice";

ReplicaController.ReplicaOfClassCreated("PlayerData", (replica) => {
  print(
    `PlayerData replica received! Received player money: ${replica.Data.Money}`
  );

  replica.ListenToChange(["Money"], (newValue) => {
    print(`Money changed: ${newValue}`);
  });
});

ReplicaController.RequestData(); // This function should only be called once in the entire codebase! Read the documentation for more information.
```

## Recommendations

- Make your `Replica.Data` simple and small without too many keys inside another keys.

## Limitations

- Paths (`StringPath` and `ArrayPath`) can only access **21 keys** of an object (this was added as a fix to the issue "Type instantiation is excessively deep and possibly infinite").

## Frequently Asked Questions

1. **My editor features (autocomplete, others) are laggy, what can I do?** Reopen your code editor (or if you're using Visual Studio Code, restart the TypeScript server), if it's still laggy, contact any of the collaborators in the `roblox-ts` server.
2. **I can't access a key in my object that is inside 35 keys!** Read the [limitations](#-limitations) and [recommendations](#-recommendations).

## Documentation

Visit the following website to go to the official ReplicaService documentation: https://madstudioroblox.github.io/ReplicaService/

## Support

If you are having issues with typings, join `roblox-ts` Discord server and mention any of the collaborators ([Mixu_78](https://discord.com/users/255257883250393091), or [Sandy Stone](https://discord.com/users/1018447375079063573)) with your issue and we'll try to help the maximum we can.

If you are having issues with ReplicaService and not the typings, [file an issue in the GitHub repository](https://github.com/MadStudioRoblox/ReplicaService/issues).
