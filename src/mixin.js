export default function (Vue) {
	Vue.mixin({ beforeCreate: init })
  function init () {
    const options = this.$options
    if (options.modalis) {
      this.$modalis = typeof options.modalis === 'function'
        ? options.modalis()
        : options.modalis
    } else if (options.parent && options.parent.$modalis) {
      this.$modalis = options.parent.$modalis
    }
  }
}