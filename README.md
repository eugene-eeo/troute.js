# troute.js

A backtracking, fast, and correct url-matcher for Javascript,
with support for only url capturing. It is meant to be embedded
as an engine in other router projects.

 - No dependencies
 - 0.7kB minified, 0.4kB with gzip
 - No performance penalty as more routes are added
 - Bring your own [query string parser](https://github.com/component/querystring)

```js
var t = troute();
t.add('/user/:name', d1);
t.add('/user/john/:photo_id', d2);

t.lookup('/user/john').data === d1;
t.lookup('/user/john/1').data === d2;
```

The order in which routes are added do not matter; the most
specific one (i.e. the least dynamic one) will be chosen.

### Coming soon:

 - Syntax plugins: allow opt-in support for wildcards,
   optional matches, etc.
 - More tests!
 - MOAR SPEED! MOAR TINY!
