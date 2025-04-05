# Replica Typings

> `roblox-ts` typings for Replica made by MadStudio.

Scrapped together hackily, but it works. Waiting for API docs to release to improve documentation. Some documentation has not been updated yet - this is a fork of Mixu78's ReplicaService typings.

## Table of Contents

- [Usage](#usage)
- [Recommendations](#recommendations)
- [Limitations](#limitations)
- [Frequently Asked Questions](#frequently-asked-questions)

## Usage
Check the `/examples` folder for examples on how to use the typings in your `roblox-ts` project.

Key note: You need to declare your Replicas globally for typesafety.
```ts
import { ReplicaServer } from "@rbxts/mad-replica";
import { Players } from "@rbxts/services";

/* THIS IS REQUIRED */
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
/* End of global declaration */

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
```

## Recommendations

- Make your `Replica.Data` simple and small without too many keys inside another keys.

## Limitations

- Paths (`StringPath` and `ArrayPath`) can only access **21 keys** of an object (this was added as a fix to the issue "Type instantiation is excessively deep and possibly infinite").

## Frequently Asked Questions

1. **My editor features (autocomplete, others) are laggy, what can I do?** Reopen your code editor (or if you're using Visual Studio Code, restart the TypeScript server), if it's still laggy, contact any of the collaborators in the `roblox-ts` server.
2. **I can't access a key in my object that is inside 35 keys!** Read the [limitations](#-limitations) and [recommendations](#-recommendations).
