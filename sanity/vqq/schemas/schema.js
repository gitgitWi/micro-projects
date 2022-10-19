import createSchema from 'part:@sanity/base/schema-creator';

import schemaTypes from 'all:part:@sanity/base/schema-type';

import { video } from './video';

export default createSchema({
  name: 'VQ',

  types: schemaTypes.concat([video]),
});
