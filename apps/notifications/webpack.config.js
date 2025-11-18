const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/notifications'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  resolve: {
    symlinks: false,
  },
  externals: {
    'pg-native': 'commonjs2 pg-native',
    'mysql2': 'commonjs2 mysql2',
    'mysql': 'commonjs2 mysql',
    'better-sqlite3': 'commonjs2 better-sqlite3',
    'sqlite3': 'commonjs2 sqlite3',
    'pg-query-stream': 'commonjs2 pg-query-stream',
    'oracledb': 'commonjs2 oracledb',
    'mongodb': 'commonjs2 mongodb',
    'mssql': 'commonjs2 mssql',
    'redis': 'commonjs2 redis',
    'ioredis': 'commonjs2 ioredis',
    'supports-color': 'commonjs2 supports-color'
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
};
