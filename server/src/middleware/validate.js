function validate({ body, query, params }) {
  return function validator(req, res, next) {
    if (body) req.body = body.parse(req.body);
    if (query) req.query = query.parse(req.query);
    if (params) req.params = params.parse(req.params);
    next();
  };
}

module.exports = { validate };

