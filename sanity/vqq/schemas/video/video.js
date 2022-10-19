import { AiFillYoutube } from 'react-icons/ai';

export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  icon: AiFillYoutube,
  fields: [
    {
      name: 'videoId',
      title: 'Youtube Video ID',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(2),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'videoId',
        maxLength: 100,
      },
    },
    {
      name: 'description',
      title: 'Youtube Video description',
      type: 'string',
      initialValue: '',
    },
    {
      name: 'releaseDate',
      title: 'Release date',
      type: 'datetime',
    },
    {
      name: 'stars',
      title: 'Stars',
      type: 'number',
      initialValue: 0,
    },
  ],
  preview: {
    select: {
      videoId: 'videoId',
      title: 'title',
      description: 'description',
      releaseDate: 'releaseDate',
      stars: 'stars',
    },
  },
};
