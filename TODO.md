my confusions

- `32:9  Error: Unsafe assignment of an "any" value.  @typescript-eslint/no-unsafe-assignment` ➡️ but `User` in `schema.prisma` does have favoriteTopics???
  - ```
      return NextResponse.json(
          { favorite_topics: user.favoriteTopics },
          { status: 200 },
    ```
  - (📍) ./src/app/api/user/favorite_topics/route.ts
- `27:13  Error: Unsafe member access .length on an "any" value.  @typescript-eslint/no-unsafe-member-access`
  - and it's bc of _response_ in `axios.get(URL).then((response) => {`
  - (📍) BookmarksBox.tsx
