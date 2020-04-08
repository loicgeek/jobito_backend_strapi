'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const {
  sanitizeEntity
} = require('strapi-utils');


module.exports = {

  async updateStatus(ctx) {
    const [application] = await strapi.services['job-application'].find({
      id: ctx.params.id
    });
    if (application) {
      if (application.job.user != ctx.state.user.id) {
        return ctx.unauthorized('You cannot access to this ressource');
      }
    } else {
      return ctx.notfound('Ressource not found');
    }

    let entity = await strapi.services['job-application'].update(
      ctx.params,
      ctx.request.body
    );

    return sanitizeEntity(entity, {
      model: strapi.models['job-application']
    });

  }
};
