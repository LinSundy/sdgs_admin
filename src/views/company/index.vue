<template>
  <div>
    <div class="import_container">
      <el-button @click="import_file" type="primary">点击导入合作公司数据</el-button>
      <el-button @click="AddCompanyFormToggle(true)" type="primary">新增单个合作公司</el-button>
      <input @change="change_event" ref="input" class="file_input" type="file"/>
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
            <div class="search-container">
              <input v-model="search"
                     class="search"
                     @keydown.enter="searchHandle"
                     type="text" placeholder="输入公司名称模糊搜索">
              <i @click="searchHandle" class="el-input__icon el-icon-search"></i>
            </div>
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑
            </el-button>
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
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="page_handle"
      class="paginate"
      :page-size="pagination.pageSize"
      background
      layout="prev, pager, next"
      :total="pagination.total">
    </el-pagination>
    <CompanyForm
      :company_obj="company_obj"
      @reGetdata="getData"
      :companyFormVisible.sync="companyFormVisible"
      v-if="companyFormVisible"/>
    <AddCompany :addCompanyFormVisible.sync="addCompanyFormVisible"
                @reGetdata="getData"
                @addCompanySubmitHandle="addCompanySubmitHandle"
                v-if="addCompanyFormVisible"></AddCompany>
  </div>
</template>

<script>
  import CompanyForm from './components/form/index'
  import AddCompany from './components/AddCompany/index'
  import XLSX from 'xlsx'
  import * as api from '../../api/company'
  import {Message} from 'element-ui'

  export default {
    name: 'Company',
    components: {
      CompanyForm,
      AddCompany
    },
    data() {
      return {
        addCompanyFormVisible: false,
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
        company_obj: null,
        pagination: {
          pageSize: 1,
          pageNum: 1,
          total: 0
        }
      }
    },
    methods: {
      page_handle(pageNum) {
        console.log(pageNum, '计算')
        this.pagination.pageNum = pageNum
        this.getData()
      },
      searchHandle() {
        console.log(this.search, 'sea')
      },
      addCompanySubmitHandle(val) {
        this.form.records.push(val)
      },
      AddCompanyFormToggle(val) {
        this.addCompanyFormVisible = val
      },
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
        reader.onloadend = function (e) {
          const data = e.target.result
          const wb = XLSX.read(data, {type: 'binary'})
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
              level: that.format_value(cell['评级']),
              credentials: that.format_value(cell['资质情况'])
            }
            that.addCompanyList.push(_data)
          })
          console.log(that.addCompanyList)
          api.addCompany({data: that.addCompanyList}).then(res => {
            that.getData()
            that.parse_loading.close()
          })
        }
        if (this.file) {
          reader.readAsBinaryString(this.file)
        }
      },
      getData() {
        api.getCompanyList(this.pagination, {data: {search_value: ''}}).then(res => {
          this.loading = false
          this.companies = res.data.companies
          this.pagination.pageNum = res.data.paginate.page
          this.pagination.total = res.data.paginate.total
          if(this.pagination.total < this.pagination.pageNum) {
            this.pagination.pageNum = this.pagination.total
            this.getData()
          }
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

  .search {
    height: 28px;
    line-height: 28px;
    -webkit-appearance: none;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: 12px;
    outline: 0;
    padding: 0 55px 0 15px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    -webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 100%;

    &:focus {
      border-color: #409EFF;
      outline: 0;
    }

    &::-webkit-input-placeholder {
      color: #C3C7D0;
    }
  }

  .search-container {
    position: relative;
    .el-input__icon {
      position: absolute;
      right: 2px;
      top: -4px;
      z-index: 10;
      cursor: pointer;
    }
  }

  .import_container {
    margin-top: 20px;
    margin-left: 20px;
  }

  .company-list {
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .paginate {
    margin-top: 20px;
    margin-left: 20px;
  }

</style>
