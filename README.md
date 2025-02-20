# Replica Typings

> `roblox-ts` typings for Replica made by MadStudio.

Scrapped together hackily, but it works. Waiting for API docs to release to improve documentation. Some documentation has not been updated yet - this is a fork of Mixu78's ReplicaService typings.

## Table of Contents

- [Recommendations](#recommendations)
- [Limitations](#limitations)
- [Frequently Asked Questions](#frequently-asked-questions)

## Recommendations

- Make your `Replica.Data` simple and small without too many keys inside another keys.

## Limitations

- Paths (`StringPath` and `ArrayPath`) can only access **21 keys** of an object (this was added as a fix to the issue "Type instantiation is excessively deep and possibly infinite").

## Frequently Asked Questions

1. **My editor features (autocomplete, others) are laggy, what can I do?** Reopen your code editor (or if you're using Visual Studio Code, restart the TypeScript server), if it's still laggy, contact any of the collaborators in the `roblox-ts` server.
2. **I can't access a key in my object that is inside 35 keys!** Read the [limitations](#-limitations) and [recommendations](#-recommendations).
