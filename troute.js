troute = function() {
  var escape = decodeURIComponent;
  function info() {
    return {
      next: {},
      param: null,
      route: null,
    };
  };

  function sanitise(url) {
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url;
  };

  var routes = info();

  function add(pattern, data) {
    var parts  = sanitise(pattern).split('/');
    var params = [];
    var t = routes;

    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      var c = p[0] == ':';
      t = (c)
        ? t.param    || (t.param = info())
        : t.next[p]  || (t.next[p] = info());
      if (c) params.push(p.slice(1));
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

    var part = escape(pieces[0]);
    var rest = pieces.slice(1);
    var tree = rules.next[part.toLowerCase()];

    if (tree) {
      var a = search(tree, rest, params);
      if (a) return a;
    }

    if (rules.param) {
      return search(rules.param, rest, params.concat([part]));
    }
  };

  return {
    add: add,
    lookup: function(url) {
      return search(routes, sanitise(url).split('/'), []);
    },
  };
};
