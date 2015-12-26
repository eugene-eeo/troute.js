troute = function() {
  function split(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url.split('/');
  };

  // tree {
  //   s: { String->tree }  static paths
  //   p: { String->tree }  paths after captured params
  //   n: String            name of captured param
  //   r: [ Object ]        included data
  // }
  var routes = {s:{}};

  function add(pattern, data) {
    var parts = split(pattern);
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var capture = part[0] == ':';
      t = capture
        ? t.p       || (t.p = {s:{}})
        : t.s[part] || (t.s[part] = {s:{}});
      if (capture)
        t.n = part.slice(1);
    }

    t.r = [data];
  };

  function lookup(url) {
    var parts  = split(url);
    var params = {};
    var tree   = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = decodeURIComponent(parts[i]);
      var n = p.toLowerCase();
      tree = tree.s[n] || (tree.p && (params[tree.p.n] = p, tree.p));
      if (!tree) return;
    };

    return tree.r && {
      params: params,
      data: tree.r[0],
    };
  };

  return {
    add: add,
    lookup: lookup,
  };
};
