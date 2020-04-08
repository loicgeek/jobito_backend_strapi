module.exports = async (ctx, next) => {
  if (ctx.state.user) {
    const controller = ctx.request.route.controller;
    const o = `${strapi.config.ownmap[controller]}.id`;
    var data = {
      id: ctx.params.id
    };
    data[o] = ctx.state.user.id;
    const [owner] = await strapi.services[controller].find(data);
    if (!owner) {
      return ctx.unauthorized(`You don't have access to this entry`);
    }
    return await next();
  }
};
