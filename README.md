# troute.js

A backtracking, fast and correct url-matcher for Javascript,
with support for only url capturing. It is meant to be embedded
in router projects.

 - No dependencies
 - 0.7kB minified, 0.4kB with gzip
 - Tree-like data structure means no performance penalty as
   more routes are added.
 - Bring your own query string parser.

```js
var t = troute();
t.add('/user/:name',          d1);
t.add('/user/john/:photo_id', d2);

t.lookup('/user/john').data === d1;
t.lookup('/user/john/1').data === d2;
```

### Coming soon:

 - Syntax plugins: allow opt-in support for wildcards,
   optional matches, etc.
 - More tests!
