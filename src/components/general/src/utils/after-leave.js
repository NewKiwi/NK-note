export default function(instance, callback, speed = 300, once = false) {
  if (!instance || !callback) throw new Error('instance & callback is required')
  let called = false
  console.log('test afterLeave', called)
  const afterLeaveCallback = function() {
    if (called) return
    called = true
    console.log(called)
    if (callback) {
      callback.apply(null, arguments)
    }
  }
  if (once) {
    instance.$once('after-leave', afterLeaveCallback)
  } else {
    instance.$on('after-leave', afterLeaveCallback)
  }
  setTimeout(() => {
    afterLeaveCallback()
  }, speed + 100)
}
