<template>
  <div>
    <el-button @click="import_file" type="primary">点击导入</el-button>
    <input @change="change_event" ref="input"  class="file_input" type="file">
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'Company',
  data() {
    return {
      file: '',
      companyList: []
    }
  },
  methods: {
    import_file() {
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
            url: that.format_value(cell['公司网址'])
          }
          that.companyList.push(_data)
        })
        console.log(that.companyList, '完活')
      }
      reader.readAsBinaryString(this.file)
    }
  }
}
</script>

<style scoped lang="scss">
.file_input {
  display: none;
}
</style>
