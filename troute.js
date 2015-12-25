troute = function() {
  function Info() {
    return {
      next: {},
      param: null,
      route: null,
      capture: null,
    };
  };

  function sanitise(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url;
  };

  var routes = Info();

  function add(pattern, data) {
    var parts = sanitise(pattern).split('/');
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var capture = part[0] == ':';
      t = capture
        ? t.param       || (t.param = Info())
        : t.next[part]  || (t.next[part] = Info());
      if (capture)
        t.capture = part.slice(1);
    }

    t.route = [data];
  };

  function lookup(url) {
    var parts  = sanitise(url).split('/');
    var params = {};
    var tree   = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = decodeURIComponent(parts[i]);
      var q = tree.next[p];
      if (q) {
        tree = q;
      } else if (tree = tree.param) {
        params[tree.capture] = p;
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
