troute = function() {
  function Info() {
    return {
      next: {},
      param: null,
      route: null,
      name: null,
    };
  };

  function split(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url.split('/');
  };

  var routes = Info();

  function add(pattern, data) {
    var parts = split(pattern);
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var capture = part[0] == ':';
      t = capture
        ? t.param       || (t.param = Info())
        : t.next[part]  || (t.next[part] = Info());
      if (capture)
        t.name = part.slice(1);
    }

    t.route = [data];
  };

  function lookup(url) {
    var parts  = split(url);
    var params = {};
    var tree   = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = decodeURIComponent(parts[i]);
      var q = tree.next[p.toLowerCase()];
      if (q) {
        tree = q;
      } else if (tree = tree.param) {
        params[tree.name] = p;
      } else {
        return;
      }
    };

    return tree.route && {
      params: params,
      data: tree.route[0],
    };
  };

  return {
    add: add,
    lookup: lookup,
  };
};
