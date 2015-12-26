# troute.js

 - Zero dependencies
 - 0.5kB minified, 0.3kB with gzip
 - No performance penalty as more routes are added
 - Bring your own [query string parser](https://github.com/component/querystring)

A tiny tree based url-matcher for JS in the browser. It is
meant to be embedded as an "engine" in other router projects.
The order in which routes are added do not matter; the most
specific one (i.e. the least dynamic one) will be chosen.

```js
var t = troute();
t.add('/user/:id', f1);
t.add('/user/:id/:photo_id', f2);

t.lookup('/user/2').cb === f1;
t.lookup('/user/2/1').params.photo_id == '1';
```

Currently there is no plan to support splats ('\*') or
regexes since I don't find myself using them very often.

### Installation

```sh
$ bower install eugene-eeo/troute.js
```
