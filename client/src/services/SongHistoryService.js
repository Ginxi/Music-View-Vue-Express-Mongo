import Api from '@/services/Api'

export default {
  index () {
    return Api().get('history')
  },
  post (history) {
    return Api().post('history', history)
  }
}
