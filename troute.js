troute = function() {
  function Info() {
    return {
      next: {},     // -> {String: Info}
      param: null,  // -> Info|null
      route: null,
    };
  };

  function sanitise(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url;
  };

  var routes = Info();

  function add(pattern, data) {
    var parts  = sanitise(pattern).split('/');
    var params = [];
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      var capture = part[0] == ':';
      t = capture
        ? t.param       || (t.param = Info())
        : t.next[part]  || (t.next[part] = Info());
      if (capture) params.push(part.slice(1));
    }

    t.route = {
      data: data,
      map: function(args) {
        var o = {};
        for (var i = args.length; i--;)
          o[params[i]] = args[i];
        return o;
      }
    };
  };

  function search(rules, pieces, params) {
    if (!pieces.length) {
      var route = rules.route;
      return route && {
        params: route.map(params),
        data: route.data,
      };
    }

    var part = pieces[0];
    var rest = pieces.slice(1);
    var tree = rules.next[part.toLowerCase()];

    if (tree) {
      var a = search(tree, rest, params);
      if (a) return a;
    }

    return rules.param
      && search(rules.param, rest, params.concat([part]));
  };

  return {
    add: add,
    lookup: function(url) {
      return search(routes,
                    sanitise(url).split('/').map(decodeURIComponent),
                    []);
    },
  };
};
