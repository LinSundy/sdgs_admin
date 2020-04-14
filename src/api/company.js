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

export function getCompanyList(params) {
  return request({
    url: '/companies/',
    method: 'get',
    params
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

export function addRecord(id, name) {
  return request({
    url: '/record/',
    method: 'post',
    params: {
      id
    },
    data: {
      name
    }
  })
}

export function delRecord(id) {
  return request({
    url: '/record/',
    method: 'delete',
    params: {
      id
    }
  })
}

export function editRecord(id, name) {
  return request({
    url: '/record/',
    method: 'put',
    params: {
      id
    },
    data: {
      name
    }
  })
}

export function editCompany(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/oneCompany/',
    method: 'put',
    data
  })
}

export function addOneCompany(data) {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/oneCompany/',
    method: 'post',
    data
  })
}
