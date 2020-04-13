<template>
  <div>
    <div class="import_container">
      <el-button @click="import_file" type="primary">点击导入合作公司数据</el-button>
      <input @change="change_event" ref="input"  class="file_input" type="file" />
    </div>
    <div class="company-list">
      <el-table
        v-loading="loading"
        :data="companies"
        style="width: 100%">
        <el-table-column
          label="公司名称"
          prop="name">
        </el-table-column>
        <el-table-column
          label="评级"
          prop="level">
        </el-table-column>
        <el-table-column
          align="right">
          <template slot="header">
            <el-input
              v-model="search"
              size="mini"
              placeholder="输入关键字搜索"/>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-popover
              placement="top"
              width="160"
              :ref="'popover-' + scope.row.id"
              >
              <p>是否确认要删除当前合作公司？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="handleCancel(scope.row.id)">取消</el-button>
                <el-button type="primary" size="mini" @click="delCompany(scope.row.id)">确定</el-button>
              </div>
              <el-button
                size="mini"
                type="danger"
                slot="reference"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </el-popover>
<!--            <el-button-->
<!--              size="mini"-->
<!--              type="danger"-->
<!--              @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <CompanyForm :company_obj="company_obj" :companyFormVisible.sync="companyFormVisible" v-if="companyFormVisible" />
  </div>
</template>

<script>
import CompanyForm from './components/form/index'
import XLSX from 'xlsx'
import * as api from '../../api/company'
import { Message } from 'element-ui'
export default {
  name: 'Company',
  components: {
    CompanyForm
  },
  data() {
    return {
      companyFormVisible: false,
      currentIndex: 0,
      visible: false,
      loading: true,
      file: '',
      addCompanyList: [],
      input3: '',
      companyList: [],
      parse_loading: null,
      companies: null,
      search: '',
      company_obj: null
    }
  },
  methods: {
    delCompany(company_id) {
      api.delCompany(company_id).then(() => {
        Message.success('删除成功!')
        this.handleCancel(company_id)
        this.getData()
      })
    },
    handleCancel(id) {
      this.$refs[`popover-${id}`].doClose()
    },
    handleEdit(index, row) {
      this.companyFormVisible = true
      this.company_obj = row
      console.log(index, row)
    },
    handleDelete(index, row) {
      row.deleteVisible = true
      console.log(index, row)
    },
    import_file() {
      this.$refs.input.value = ''
      const mouseObj = document.createEvent('MouseEvents')
      mouseObj.initEvent('click', true, true)
      this.$refs.input.dispatchEvent(mouseObj)
    },
    format_value(val) {
      if (val && typeof val === 'string') {
        return val.trim().replace(/[\r\n]/g, '')
      }
      return val
    },
    change_event(e) {
      this.parse_loading = this.$loading({
        lock: true,
        text: '正在智能解析中，请耐心等待哦~',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.addCompanyList = []
      this.file = e.target.files[0]
      const reader = new FileReader()
      const that = this
      reader.onloadend = function(e) {
        const data = e.target.result
        const wb = XLSX.read(data, { type: 'binary' })
        const wk_sheet = wb.Sheets[wb.SheetNames[0]]
        const sheet_json = XLSX.utils.sheet_to_json(wk_sheet)
        sheet_json.forEach(cell => {
          const _data = {
            name: that.format_value(cell['单位名称']),
            industry_type: that.format_value(cell['行业类别']),
            info: that.format_value(cell['单位简介']),
            register_capital: that.format_value(cell['注册资本']),
            records: that.format_value(cell['已合作项目']),
            contact_person: that.format_value(cell['联系人']),
            contacts: that.format_value(cell['联系方式']),
            recent_situation: that.format_value(cell['近三年业绩情况']),
            url: that.format_value(cell['公司网址']),
            level: that.format_value(cell['评级'])
          }
          that.addCompanyList.push(_data)
        })
        console.log(that.addCompanyList)
        api.addCompany({ data: that.addCompanyList }).then(res => {
          that.getData()
          that.parse_loading.close()
        })
      }
      if (this.file) {
        reader.readAsBinaryString(this.file)
      }
    },
    getData() {
      api.getCompanyList().then(res => {
        this.loading = false
        this.companies = res.data
      }).catch(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>

<style scoped lang="scss">
.file_input {
  display: none;
}
.import_container {
  margin-top: 20px;
  margin-left: 20px;
  .search {
    float: left;
    margin-right: 10px;
  }
}
.company-list {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
.company-form {

}
</style>
