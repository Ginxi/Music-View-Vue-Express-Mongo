import Api from '@/services/Api'

export default {
  index (params) {
    return Api().get('bookmarks', {params: params})
  },
  post (params) {
    return Api().post('bookmarks', {params: params})
  },
  delete (bookmarkId) {
    return Api().delete(`bookmarks/${bookmarkId}`)
  }
}
