# troute.js

A tiny tree based url-matcher for Javascript. It is meant to be
embedded as an engine in other router projects.

 - No dependencies
 - 0.5kB minified, 0.3kB with gzip
 - No performance penalty as more routes are added
 - Bring your own [query string parser](https://github.com/component/querystring)

```js
var t = troute({});
t.add('/user/:name', d1);
t.add('/user/:name/:photo_id', d2);

t.lookup('/user/john').data === d1;
t.lookup('/user/john/1').params.photo_id == '1';
```

The order in which routes are added do not matter; the most
specific one (i.e. the least dynamic one) will be chosen.

### Coming soon:

 - Syntax plugins: allow opt-in support for wildcards,
   optional matches, etc.
 - More tests!
 - MOAR SPEED! MOAR TINY!
