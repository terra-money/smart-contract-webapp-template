// DO NOT EDIT MANUALLY : THIS FILE IS AUTO CREATED
/* eslint-disable */
// prettier-ignore
// noinspection JSUnusedGlobalSymbols

export type int32 = number;
/**A human readable address.

In Cosmos, this is typically bech32 encoded. But for multi-chain smart contracts no assumptions should be made other than being UTF-8 encoded and of reasonable length.

This type represents a validated address. It can be created in the following ways 1. Use `Addr::unchecked(input)` 2. Use `let checked: Addr = deps.api.addr_validate(input)?` 3. Use `let checked: Addr = deps.api.addr_humanize(canonical_addr)?` 4. Deserialize from JSON. This must only be done from JSON that was validated before such as a contract's state. `Addr` must not be used in messages sent by the user because this would result in unvalidated instances.

This type is immutable. If you really need to mutate it (Really? Are you sure?), create a mutable copy using `let mut mutable = Addr::to_string()` and operate on that `String` instance.*/
export type Addr = string;
export namespace counter {
    /**Response type of QueryMsg.GetCount*/
    export interface CountResponse {
        /**count property*/
        count: int32;
    }
    export namespace ExecuteMsg {
        /**increment count*/
        export interface Increment {
            increment: {};
        }
        /**decrement count*/
        export interface Decrement {
            decrement: {};
        }
        /**reset count (contract owner only)*/
        export interface Reset {
            reset: {
                /**count*/
                count: int32;
            };
        }
    }
    export interface InstantiateMsg {
        /**count*/
        count: int32;
    }
    export namespace QueryMsg {
        /**@return CountResponse*/
        export interface GetCount {
            get_count: {};
        }
    }
    export interface State {
        /**count state*/
        count: int32;
        /**contract owner*/
        owner: Addr;
    }
}
