'use strict';

const {
  parseMultipartData,
  sanitizeEntity
} = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {

	  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const {
        data,
        files
      } = parseMultipartData(ctx);
      data.user = ctx.state.user.id;
      entity = await strapi.services['enterprise-profile'].create(data, {
        files
      });
    } else {
      ctx.request.body.user = ctx.state.user.id;
      entity = await strapi.services['enterprise-profile'].create(ctx.request.body);
    }
    return sanitizeEntity(entity, {
      model: strapi.models['enterprise-profile']
    });
  },

};
