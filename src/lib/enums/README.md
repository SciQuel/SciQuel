# Enums `lib/enums`

To handle typechecking and to ensure that the same values to represent the same type of each category is used wherever necessary, we will use enums. TypeScript has built in support for enums, but its syntax and representation is less than ideal. Instead, we will use a custom enum syntax which will be described in this doc.

## Properties

The enums used here follow the const object format. You can learn more about this style [in this video](https://www.youtube.com/watch?v=jjMbPt_H3RQ). In addition to the enum itself as described in the video, we also expose a helper type `EnumKey` to typecheck enum keys. This structure has multiple advantages; it allows us to:

1. define string values that represent the human-readable portion of the enum value.

   For example:

   ```typescript
   const Fruit = {
     APPLE: "apple",
     ORANGE: "orange",
   } as const;
   ```

   In this enum, the key to represent the concept of apple is `"APPLE"`, and the human-readable value is accessible from `Fruit.APPLE` which is `"apple"`.

2. create a unique key.

   In the enum above, there can only be 1 `APPLE` and 1 `ORANGE` key.

3. ensure typechecking and provide code completion with IDEs.

   Using the helper types, we can typecheck and represent enum keys as follows:

   ```typescript
   import { type EnumKey } from "@/lib/enums";
   import Fruit from "@/lib/enums/Fruit";

   // Notice how we expect the key of the enum
   function getString(fruit: EnumKey<typeof Fruit>): string {
     return Fruit[fruit]; // This call is typechecked
   }
   ```

   Code completion available on VSCode with JS/TS language features:
   
   <img width="553" alt="Screenshot 2023-06-01 at 11 58 44 AM" src="https://github.com/SciQuel/SciQuel/assets/17174688/345b5ee8-1d13-4c95-ba99-a3272705d434">


## Importing

All enums should be available at `@/lib/enums/<name>`. Import like so:

```typescript
import Topic from "@/lib/enums/Topic";
```

The `EnumKey` helper can be imported from `@/lib/enums`. Import like so:

```typescript
import { type EnumKey } from "@/lib/enums";
```
