troute = function() {
  function split(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url.split('/');
  };

  // tree {
  //   s: { String->tree }  static paths
  //   p: { String->tree }  paths after captured param
  //   n: String            name of captured param
  //   r: Object            included callback
  // }
  var routes = {s:{}};

  function add(pattern, fn) {
    var parts = split(pattern);
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var c = p[0] == ':';
      if (c)
        t.n = p.slice(1);
      t = c
        ? t.p    || (t.p = {s:{}})
        : t.s[p] || (t.s[p] = {s:{}});
    }

    t.r = fn;
  };

  function lookup(url) {
    var parts  = split(url);
    var params = {};
    var tree   = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = decodeURIComponent(parts[i]);
      var n = p.toLowerCase();
      tree = tree.s[n] || (params[tree.n] = p, tree.p);
      if (!tree) return;
    };

    return ('r' in tree) && {
      params: params,
      cb: tree.r,
    };
  };

  return {
    add: add,
    lookup: lookup,
  };
};
