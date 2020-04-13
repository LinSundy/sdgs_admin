import request from '@/utils/request'

export function addCompany(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 30000,
    url: '/company/list/',
    method: 'post',
    data
  })
}

export function getCompanyList() {
  return request({
    url: '/companies/',
    method: 'get'
  })
}

export function delCompany(id) {
  return request({
    url: '/companies/',
    method: 'delete',
    params: {
      id
    }
  })
}
