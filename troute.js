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
    var hash = url.indexOf('#');
    if (~hash)                    url = url.slice(0, hash);
    if (~url.indexOf('/?'))       url = url.replace('/?', '?');
    if (url[0] == '/')            url = url.slice(1);
    if (url[url.length-1] == '/') url = url.slice(0, -1);
    return url;
  };

  function parse_qs(qs, res) {
    if (qs && res) {
      var query = qs.split('&');
      for (var i = 0; i < query.length; i++) {
        var q = query[i].split('=');
        res.query[q[0]] = escape(q[1]);
      }
    }
  }

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
    return routes;
  };

  function search(rules, pieces, params) {
    if (!pieces.length) {
      var route = rules.route;
      return route && {
        query: {},
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
      var u = sanitise(url).split('?');
      var t = search(routes, u[0].split('/'), []);
      parse_qs(u[1], t);
      return t;
    },
  };
};
