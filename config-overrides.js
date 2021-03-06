const {
  override,
  disableEsLint,
  overrideDevServer,
  watchAll,
  addBabelPlugins
} = require("customize-cra");

module.exports = {
  webpack: override(
    // usual webpack plugin
    disableEsLint(),
    ( process.env === 'production' ) ? addBabelPlugins('transform-remove-console') : null
  )
};
/*const {override, addBabelPlugins} = require("customize-cra");

module.exports = function override(config, env) {
  console.log(override);
  if( env === 'production' ) return override( 
  	addBabelPlugins('transform-remove-console') 
  	) ( config, env )

  return config;
}*/