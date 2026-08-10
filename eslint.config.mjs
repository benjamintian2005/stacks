import nextConfig from 'eslint-config-next';

const eslintConfig = [
  ...nextConfig,
  {
    ignores: ['lib/generated/**'],
  },
];

export default eslintConfig;
